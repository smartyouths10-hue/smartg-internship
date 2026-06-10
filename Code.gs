/**
 * SMARTG SDN BHD — 实习申请表单 → Google Sheet 接收脚本
 * =====================================================
 * 部署步骤（一次性）：
 *  1. 打开 https://sheets.google.com 新建一个空白表格，命名例如「Internship Applications」。
 *  2. 顶部菜单 Extensions（扩展程序）→ Apps Script，把本文件全部内容贴进去，覆盖原有代码。
 *  3. 点击上方「保存」💾。
 *  4. 点击右上角「Deploy（部署）」→「New deployment（新建部署）」。
 *     - 类型选择 ⚙️ → 「Web app」。
 *     - Execute as（执行身份）：Me（你自己）。
 *     - Who has access（谁可访问）：Anyone（任何人）。← 一定要选这个，否则网页无法写入。
 *  5. 点「Deploy」，授权（第一次会要求登录授权，点 Advanced → Go to project → Allow）。
 *  6. 复制得到的「Web app URL」，粘贴到 index.html 里的 GOOGLE_SCRIPT_URL。
 *
 *  ⚠️ 之后每次修改本脚本，要重新「Deploy → Manage deployments → 编辑 → New version」才会生效。
 */

// 表头（顺序要和下面 appendRow 一致）
const HEADERS = ['提交时间', '姓名', '电话', 'Gmail', '目前职业', '居住区域'];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // 第一次写入时自动补表头
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    }

    sheet.appendRow([
      data.timestamp || new Date(),
      data.name       || '',
      data.phone      || '',
      data.email      || '',
      data.occupation || '',
      data.area       || '',
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 可选：浏览器直接打开 Web app URL 时显示的提示，方便确认部署成功
function doGet() {
  return ContentService.createTextOutput('SMARTG internship endpoint is live ✅');
}
