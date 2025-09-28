import ExcelJS from "exceljs";
import fs from "fs";

// Function to convert Excel file to JSON (fixed version)
async function excelToJSONStream(excelFilePath, jsonFilePath) {
  console.log(`Converting ${excelFilePath} to ${jsonFilePath}...`);

  const jsonData = [];
  let worksheetCount = 0;

  try {
    // Use regular workbook reading instead of streaming for better shared string handling
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(excelFilePath);

    workbook.eachSheet((worksheet, sheetId) => {
      worksheetCount++;
      console.log(`Processing worksheet: ${worksheet.name}`);

      let headers = [];
      let rowCount = 0;

      worksheet.eachRow((row, rowNumber) => {
        rowCount++;

        if (rowNumber === 1) {
          // First row contains headers
          row.eachCell((cell, colNumber) => {
            headers[colNumber] = cell.value || `Column${colNumber}`;
          });
        } else {
          // Data rows
          const rowObject = {};
          row.eachCell((cell, colNumber) => {
            const header = headers[colNumber];
            if (header) {
              rowObject[header] = cell.value;
            }
          });

          // Add to JSON data if it has content
          if (Object.keys(rowObject).length > 0) {
            jsonData.push(rowObject);
          }
        }
      });
    });

    console.log(
      `Excel processing complete! Total worksheets: ${worksheetCount}`
    );

    // Write JSON to file
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2), "utf-8");
    console.log(`✅ Converted ${excelFilePath} to ${jsonFilePath}`);
    console.log(`   Total records: ${jsonData.length}`);

    return jsonData;
  } catch (error) {
    console.error("❌ Conversion failed:", error);
    throw error;
  }
}

export default excelToJSONStream;
