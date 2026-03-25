# 球隊報名系統

## 目標

建立一個輕量的 Web 表單，讓球員填寫報名資料並上傳個資同意書，資料自動寫入 Google Sheet 及 Google Drive。每年可重複使用。

## 功能需求

### 1. 報名表單

- 球員填寫：姓名、出生年月日、是否為初次參賽者（checkbox）
- 前端欄位驗證（必填、格式檢查）
- 資料寫入 Google Sheet「報名資訊」
- 提交成功後顯示確認訊息

### 2. 個資同意書上傳

- 球員上傳已簽名的 PDF/圖片檔
- 檔案類型白名單：`image/*`、`application/pdf`
- 檔案上傳至 Google Drive 指定的「個資」folder
- 檔案命名規則：`{球員名稱}.{副檔名}`

### 3. 安全防護

- Google reCAPTCHA v3 驗證（背景運作，使用者無感）
  - 前端取得 reCAPTCHA token，隨表單一起 POST
  - Apps Script 呼叫 Google reCAPTCHA verify API 驗證 token
  - 分數低於門檻（如 0.5）則拒絕提交
- Apps Script 內做欄位驗證（必填、格式、檔案類型白名單）
- Apps Script 內做 payload 大小檢查
- 報名結束後取消發布 Web App，關閉 endpoint

### 4. 資料權限管理

- Google Sheet / Drive folder 權限最小化，僅管理員可存取
- Apps Script 使用專用 Google 帳號，非個人主帳號

## 技術架構

```
靜態前端（GitHub Pages）
        ↓ fetch POST（含 reCAPTCHA token）
Google Apps Script
        ├── reCAPTCHA 驗證（UrlFetchApp）
        ├── 欄位驗證
        ├── 寫入 Google Sheet（SpreadsheetApp）
        └── 上傳檔案至 Google Drive（DriveApp）
```

### 前端

- Vite + React + TypeScript
- UI：shadcn/ui（Radix UI + Tailwind CSS）
- 建置後為靜態檔案，部署於 GitHub Pages（免費）

### 後端

- Google Apps Script 作為 serverless function
- 透過 `doPost(e)` 接收前端 POST 請求
- 使用 `SpreadsheetApp` 寫入 Google Sheet
- 使用 `DriveApp` 上傳檔案至指定 folder
- 使用 `UrlFetchApp` 驗證 reCAPTCHA token
- Sheet ID / Drive Folder ID / reCAPTCHA secret key 存放於 Script Properties

### 為什麼選 Apps Script

- Client 端零機密資料（無 API key、無 Service Account 金鑰）
- 天生有 Google Sheets / Drive 存取權限，不需額外設定認證
- 免費、無需維護 server
- 對此規模需求完全足夠，不需要自建 server

## 限制與注意事項

- Apps Script 單次執行上限 6 分鐘
- 單檔上傳上限 50MB
- 免費帳號每日 API 呼叫約 20,000 次
- reCAPTCHA v3 免費額度每月 100 萬次

## 年度重複使用

每年需產出獨立的：
1. 球員名單 Google Sheet
2. 個資同意書 Drive Folder

### 年度初始化機制

- Apps Script 內建管理用 function（如 `initNewSeason()`）
- 執行後自動：
  - 建立新的 Google Sheet（含欄位標題）
  - 建立新的 Drive Folder
  - 更新 Script Properties 中的 Sheet ID / Folder ID
- 管理員只需執行一次此 function，不需手動複製或改設定
- 前端不需更動（Apps Script URL 不變）

### 報名期間管理

- 開始報名：發布 Web App
- 結束報名：取消發布 Web App
