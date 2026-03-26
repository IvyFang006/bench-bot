/**
 * Initialize a new season.
 * Finds the "校友盃報名" folder in Google Drive, creates a year subfolder
 * containing the player sheet and consent folder, then updates Script Properties.
 * Run this function manually from the Apps Script editor at the start of each season.
 *
 * Prerequisites:
 * - A folder named "校友盃報名" must exist in your Google Drive.
 *
 * Result:
 *   校友盃報名/
 *     └── 2026/
 *           ├── 球員名單（Google Sheet）
 *           ├── 個資同意書/
 *           ├── 大頭貼/
 *           └── 畢業證書/
 */
function initNewSeason() {
  var year = new Date().getFullYear();

  // Find "校友盃報名" folder
  var folders = DriveApp.getFoldersByName("校友盃報名");
  if (!folders.hasNext()) {
    throw new Error("找不到「校友盃報名」資料夾，請先在 Google Drive 中建立");
  }
  var rootFolder = folders.next();

  // Check if year folder already exists
  var existingFolders = rootFolder.getFoldersByName(String(year));
  if (existingFolders.hasNext()) {
    throw new Error("「" + year + "」資料夾已存在，請勿重複初始化");
  }

  // Create year subfolder (e.g. "2026")
  var yearFolder = rootFolder.createFolder(String(year));

  // Create subfolders inside year folder
  var consentFolder = yearFolder.createFolder("個資同意書");
  var photoFolder = yearFolder.createFolder("大頭貼");
  var diplomaFolder = yearFolder.createFolder("畢業證書");

  // Create Google Sheet
  var spreadsheet = SpreadsheetApp.create("球員名單");
  var sheet = spreadsheet.getActiveSheet();
  sheet.appendRow(["姓名", "出生年月日", "IG", "備註1", "備註2", "提交時間"]);

  // Style header row
  var headerRange = sheet.getRange(1, 1, 1, 6);
  headerRange.setFontWeight("bold");
  headerRange.setBackground("#f3f4f6");

  // Set column widths
  sheet.setColumnWidth(1, 120);
  sheet.setColumnWidth(2, 120);
  sheet.setColumnWidth(3, 150);
  sheet.setColumnWidth(4, 100);
  sheet.setColumnWidth(5, 100);
  sheet.setColumnWidth(6, 180);

  // Move sheet into year folder
  var sheetFile = DriveApp.getFileById(spreadsheet.getId());
  yearFolder.addFile(sheetFile);
  DriveApp.getRootFolder().removeFile(sheetFile);

  // Update Script Properties
  var props = PropertiesService.getScriptProperties();
  props.setProperty("SHEET_ID", spreadsheet.getId());
  props.setProperty("FOLDER_ID", consentFolder.getId());
  props.setProperty("PHOTO_FOLDER_ID", photoFolder.getId());
  props.setProperty("DIPLOMA_FOLDER_ID", diplomaFolder.getId());

  Logger.log("Season initialized: " + year);
  Logger.log("Year folder: " + yearFolder.getUrl());
  Logger.log("Sheet: " + spreadsheet.getUrl());
  Logger.log("Consent folder: " + consentFolder.getUrl());
  Logger.log("Photo folder: " + photoFolder.getUrl());
  Logger.log("Diploma folder: " + diplomaFolder.getUrl());
}
