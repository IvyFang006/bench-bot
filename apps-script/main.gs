/**
 * Handle POST requests from the registration form.
 */
function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);

    // reCAPTCHA verification
    var recaptchaResult = verifyRecaptcha(body.recaptchaToken);
    if (!recaptchaResult.success || recaptchaResult.score < 0.5) {
      return jsonResponse(false, "reCAPTCHA 驗證失敗");
    }

    // Field validation
    var validation = validateFields(body);
    if (!validation.valid) {
      return jsonResponse(false, validation.message);
    }

    // Write to Google Sheet
    var props = PropertiesService.getScriptProperties();
    var sheetId = props.getProperty("SHEET_ID");
    var folderId = props.getProperty("FOLDER_ID");

    if (!sheetId || !folderId) {
      return jsonResponse(false, "系統尚未初始化，請聯繫管理員");
    }

    var sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();
    var now = new Date();
    sheet.appendRow([
      body.name,
      body.birthday,
      body.isFirstTime ? "初次參賽者" : "",
      Utilities.formatDate(now, "Asia/Taipei", "yyyy-MM-dd HH:mm:ss"),
    ]);

    // Upload consent file to Google Drive
    if (body.consentFile && body.consentFile.data) {
      var folder = DriveApp.getFolderById(folderId);
      var decoded = Utilities.base64Decode(body.consentFile.data);
      var blob = Utilities.newBlob(decoded, body.consentFile.mimeType, body.consentFile.fileName);
      folder.createFile(blob);
    }

    return jsonResponse(true, "報名成功");
  } catch (err) {
    return jsonResponse(false, "伺服器錯誤：" + err.message);
  }
}

/**
 * Verify reCAPTCHA v3 token.
 */
function verifyRecaptcha(token) {
  if (!token) return { success: false, score: 0 };

  var secretKey = PropertiesService.getScriptProperties().getProperty("RECAPTCHA_SECRET_KEY");
  var response = UrlFetchApp.fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "post",
    payload: {
      secret: secretKey,
      response: token,
    },
  });

  return JSON.parse(response.getContentText());
}

/**
 * Validate required fields.
 */
function validateFields(body) {
  if (!body.name || !body.name.trim()) {
    return { valid: false, message: "姓名為必填" };
  }
  if (!body.birthday) {
    return { valid: false, message: "出生年月日為必填" };
  }
  if (!body.consentFile || !body.consentFile.data) {
    return { valid: false, message: "請上傳個資同意書" };
  }

  var allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
  ];
  if (allowedTypes.indexOf(body.consentFile.mimeType) === -1) {
    return { valid: false, message: "檔案類型不支援，僅接受 PDF 或圖片檔" };
  }

  return { valid: true };
}

/**
 * Return a JSON response.
 */
function jsonResponse(success, message) {
  return ContentService.createTextOutput(
    JSON.stringify({ success: success, message: message })
  ).setMimeType(ContentService.MimeType.JSON);
}
