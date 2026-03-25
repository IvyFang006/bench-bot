# Implementation Plan

## Phase 1: Google 環境設定

1. 建立專用 Google 帳號（或使用現有管理帳號）
2. 申請 Google reCAPTCHA v3，取得 site key 和 secret key
3. 建立 Apps Script 專案，將 reCAPTCHA secret key 寫入 Script Properties

## Phase 2: Apps Script 後端

1. 實作 `doPost(e)` 主流程
   - 解析 request body
   - reCAPTCHA token 驗證（`UrlFetchApp` 呼叫 verify API）
   - 欄位驗證（必填、格式、payload 大小）
   - 檔案類型白名單檢查
2. 實作 Google Sheet 寫入
   - 使用 `SpreadsheetApp.openById()` + `appendRow()`
3. 實作 Google Drive 檔案上傳
   - 前端傳 Base64，Apps Script 解碼後用 `DriveApp` 建立檔案
   - 檔案命名：`{球員名稱}_{背號}_{時間戳}.{副檔名}`
4. 實作 `initNewSeason()` 管理 function
   - 自動建立新 Google Sheet（含欄位標題：名稱、生日、背號、提交時間）
   - 自動建立新 Drive Folder
   - 更新 Script Properties 中的 Sheet ID / Folder ID
5. 統一錯誤處理與回傳格式（JSON）
6. 部署為 Web App 並測試 endpoint

## Phase 3: 前端專案建置

1. 初始化 Vite + React + TypeScript 專案
2. 安裝並設定 Tailwind CSS
3. 安裝並設定 shadcn/ui
4. 使用的 shadcn/ui 元件：
   - `Input`（名稱、背號）
   - `DatePicker`（生日）
   - `Button`（送出）
   - `Card`（表單容器）
   - `Label`（欄位標籤）
   - `Alert`（成功/錯誤訊息）
   - 檔案上傳（file input + 自訂樣式或 Dropzone）

## Phase 4: 前端邏輯

1. 前端驗證
   - 必填檢查、背號範圍、檔案大小/類型
2. reCAPTCHA v3 整合
   - 載入 reCAPTCHA script
   - 提交時執行 `grecaptcha.execute()` 取得 token
3. 表單提交邏輯
   - 檔案轉 Base64
   - 連同表單資料 + reCAPTCHA token 一起 POST 到 Apps Script
   - 處理成功/失敗回應，顯示對應訊息
4. RWD（mobile-friendly）

## Phase 5: 整合測試與部署

1. 端對端測試：填表 → 驗證 → Sheet 寫入 → Drive 上傳
2. 測試 reCAPTCHA 攔截效果
3. 測試錯誤情境（缺欄位、錯誤檔案類型、大檔案）
4. 部署前端至 GitHub Pages
5. 確認 Google Sheet / Drive 權限設定正確

## Phase 6: 文件

1. 撰寫年度操作 SOP（執行 `initNewSeason()` + 發布/取消發布 Web App 的步驟）
