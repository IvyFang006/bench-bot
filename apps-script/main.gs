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
    var photoFolderId = props.getProperty("PHOTO_FOLDER_ID");
    var diplomaFolderId = props.getProperty("DIPLOMA_FOLDER_ID");

    if (!sheetId || !folderId) {
      return jsonResponse(false, "系統尚未初始化，請聯繫管理員");
    }

    var sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();
    var now = new Date();
    var rowData = [
      body.name,
      body.birthday,
      body.ig || "",
      body.isFirstTime ? "初次參賽者" : "",
      body.isGraduating ? "應屆畢業生" : "",
      Utilities.formatDate(now, "Asia/Taipei", "yyyy-MM-dd HH:mm:ss"),
    ];

    // Check for existing row with same name, overwrite if found
    var existingRow = findExistingRow(sheet, body.name);
    if (existingRow > 0) {
      sheet.getRange(existingRow, 1, 1, rowData.length).setValues([rowData]);
    } else {
      sheet.appendRow(rowData);
    }

    // Upload consent file to Google Drive (replace existing if found)
    uploadFileToDrive(body.consentFile, folderId);

    // Upload photo if provided (first-time participants)
    if (body.photoFile && body.photoFile.data && photoFolderId) {
      uploadFileToDrive(body.photoFile, photoFolderId);
    }

    // Upload diploma if provided (graduating students)
    if (body.diplomaFile && body.diplomaFile.data && diplomaFolderId) {
      uploadFileToDrive(body.diplomaFile, diplomaFolderId);
    }

    return jsonResponse(true, "報名成功");
  } catch (err) {
    return jsonResponse(false, "伺服器錯誤：" + err.message);
  }
}

/**
 * Upload a file to a Google Drive folder, replacing any existing file with the same name.
 */
function uploadFileToDrive(filePayload, folderId) {
  if (!filePayload || !filePayload.data || !folderId) return;

  var folder = DriveApp.getFolderById(folderId);
  var decoded = Utilities.base64Decode(filePayload.data);
  var blob = Utilities.newBlob(decoded, filePayload.mimeType, filePayload.fileName);

  // Delete old file with same name
  var existingFiles = folder.getFilesByName(filePayload.fileName);
  while (existingFiles.hasNext()) {
    existingFiles.next().setTrashed(true);
  }

  folder.createFile(blob);
}

/**
 * Find an existing row by name. Returns row number (1-based) or -1 if not found.
 */
function findExistingRow(sheet, name) {
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) { // skip header
    if (data[i][0] === name) {
      return i + 1; // 1-based row number
    }
  }
  return -1;
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
