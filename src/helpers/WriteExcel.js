import ExcelJS from "exceljs";

// Write Excel with streaming for large datasets
async function writeExcelStream(data, excelFilePath) {
  console.log("📝 Writing Excel file...");

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  // Add headers
  if (data.length > 0) {
    const headers = Object.keys(data[0]);
    worksheet.addRow(headers);

    // Style header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
  }

  // Add data rows
  console.log(`   ➕ Adding ${data.length} rows to Excel...`);
  data.forEach((item, index) => {
    const row = Object.values(item);
    worksheet.addRow(row);

    if ((index + 1) % 1000 === 0) {
      console.log(`     ⚡ Added ${index + 1} rows...`);
    }
  });

  // Auto-fit columns
  console.log("   🔧 Adjusting column widths...");
  worksheet.columns.forEach((column) => {
    let maxLength = 0;
    column.eachCell({ includeEmpty: true }, (cell) => {
      const columnLength = cell.value ? cell.value.toString().length : 10;
      if (columnLength > maxLength) {
        maxLength = columnLength;
      }
    });
    column.width = Math.min(Math.max(maxLength, 10), 50);
  });

  // Save the workbook
  console.log("   💾 Saving Excel file...");
  await workbook.xlsx.writeFile(excelFilePath);
  console.log(`💾 Excel file saved: ${excelFilePath}`);
}

export { writeExcelStream };
