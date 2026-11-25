#!/usr/bin/env python3
"""從 App Store Connect 銷售報告計算 App 的累計下載數，輸出 stats.json。

在 GitHub Actions 中每天執行（見 .github/workflows/pages.yml）。
需要的環境變數（GitHub Secrets）：
  ASC_KEY_ID, ASC_ISSUER_ID, ASC_KEY_P8   App Store Connect API 金鑰（需要「管理」或「財務/銷售」權限）
  ASC_VENDOR_NUMBER                      廠商編號（App Store Connect →「報告」頁面左上角）
可選：
  APP_APPLE_ID   App 的 Apple ID（預設 6838631520）
  START_DATE     從哪一天開始計算（預設 2026-11-24，App 第一次送審的日期）

計算方式：已結算的月份用「月報」，最近的日子用「日報」，只計算首次下載
（Product Type Identifier 為 1 / 1F / 1T），不含更新與重新下載。
任何環境變數缺少或 API 發生非預期錯誤時，不會寫出 stats.json（網頁會顯示預設文字），
並以結束碼 0 結束，避免影響網站部署。
"""
import csv
import datetime as dt
import gzip
import io
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

API = "https://api.appstoreconnect.apple.com/v1/salesReports"
FIRST_TIME_TYPES = {"1", "1F", "1T"}
MONTHLY_READY_DAYS = 10  # 月報通常在下個月初幾天內產生，保守一點等 10 天


class ReportError(Exception):
    pass


def make_token(key_id, issuer_id, private_key):
    import jwt  # PyJWT

    now = int(time.time())
    return jwt.encode(
        {"iss": issuer_id, "iat": now, "exp": now + 15 * 60, "aud": "appstoreconnect-v1"},
        private_key,
        algorithm="ES256",
        headers={"kid": key_id, "typ": "JWT"},
    )


def parse_units(tsv_bytes, app_id):
    """加總報告中屬於這個 App 的首次下載數。"""
    text = tsv_bytes.decode("utf-8", errors="replace")
    reader = csv.DictReader(io.StringIO(text), delimiter="\t")
    total = 0
    for row in reader:
        if (row.get("Apple Identifier") or "").strip() != str(app_id):
            continue
        if (row.get("Product Type Identifier") or "").strip() not in FIRST_TIME_TYPES:
            continue
        try:
            total += int(float(row.get("Units") or 0))
        except ValueError:
            pass
    return total


def http_fetch(url, token):
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {token}", "Accept": "application/a-gzip"})
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return resp.status, resp.read()
    except urllib.error.HTTPError as e:
        return e.code, e.read()


def fetch_report(fetch, token, vendor, frequency, report_date):
    """回傳報告的 TSV 內容；沒有銷售（404）時回傳 None。"""
    last = None
    for version in ("1_1", "1_0"):
        params = {
            "filter[frequency]": frequency,
            "filter[reportDate]": report_date,
            "filter[reportSubType]": "SUMMARY",
            "filter[reportType]": "SALES",
            "filter[vendorNumber]": vendor,
            "filter[version]": version,
        }
        status, body = fetch(API + "?" + urllib.parse.urlencode(params), token)
        if status == 200:
            return gzip.decompress(body)
        if status == 404:
            return None  # 這段期間沒有任何銷售/下載，或報告尚未產生
        last = (status, body[:300])
        if status != 400:  # 400 可能是版本不支援，換另一個版本再試
            break
    raise ReportError(f"{frequency} {report_date}: HTTP {last[0]} {last[1]!r}")


def plan_periods(start, today):
    """回傳要查詢的 (frequency, report_date) 清單。"""
    yesterday = today - dt.timedelta(days=1)
    periods = []
    month = dt.date(start.year, start.month, 1)
    while month <= yesterday:
        next_month = dt.date(month.year + (month.month // 12), month.month % 12 + 1, 1)
        # 整個月都在開始日之後、且月報已產生 → 用月報；否則逐日查詢
        if month >= start and next_month + dt.timedelta(days=MONTHLY_READY_DAYS) <= today:
            periods.append(("MONTHLY", month.strftime("%Y-%m")))
        else:
            day = max(month, start)
            while day < next_month and day <= yesterday:
                periods.append(("DAILY", day.isoformat()))
                day += dt.timedelta(days=1)
        month = next_month
    return periods


def count_downloads(fetch, token, vendor, app_id, start, today):
    total = 0
    for frequency, report_date in plan_periods(start, today):
        tsv = fetch_report(fetch, token, vendor, frequency, report_date)
        if tsv:
            total += parse_units(tsv, app_id)
    return total


def main():
    env = os.environ
    required = ["ASC_KEY_ID", "ASC_ISSUER_ID", "ASC_KEY_P8", "ASC_VENDOR_NUMBER"]
    missing = [k for k in required if not env.get(k)]
    if missing:
        print(f"::warning::略過下載數統計，缺少 Secrets：{', '.join(missing)}")
        return 0
    app_id = env.get("APP_APPLE_ID") or "6838631520"
    start = dt.date.fromisoformat(env.get("START_DATE") or "2026-11-24")
    out = sys.argv[1] if len(sys.argv) > 1 else "stats.json"
    try:
        token = make_token(env["ASC_KEY_ID"], env["ASC_ISSUER_ID"], env["ASC_KEY_P8"])
        total = count_downloads(http_fetch, token, env["ASC_VENDOR_NUMBER"], app_id, start, dt.date.today())
    except Exception as e:  # 任何錯誤都不要讓網站部署失敗
        print(f"::warning::下載數統計失敗，網頁會顯示預設文字：{e}")
        return 0
    stats = {"downloads": total, "updated": dt.date.today().isoformat(), "source": "App Store Connect Sales Reports"}
    with open(out, "w", encoding="utf-8") as f:
        json.dump(stats, f, ensure_ascii=False)
    print(f"✔ 累計下載數：{total}（已寫入 {out}）")
    return 0


if __name__ == "__main__":
    sys.exit(main())
