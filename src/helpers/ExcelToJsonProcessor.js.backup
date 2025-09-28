import ExcelJS from "exceljs";
import fs from "fs";

// Function to convert Excel file to JSON with streaming
async function excelToJSONStream(excelFilePath, jsonFilePath) {
  console.log(
    `📊 Converting ${excelFilePath} to ${jsonFilePath} with streaming...`
  );

  const jsonData = [];
  let worksheetCount = 0;

  try {
    const workbookReader = new ExcelJS.stream.xlsx.WorkbookReader(
      excelFilePath,
      {
        entries: "emit",
        worksheets: "emit",
        sharedStrings: "cache",
        styles: "ignore",
        hyperlinks: "ignore",
      }
    );

    return new Promise((resolve, reject) => {
      workbookReader.on("worksheet", (worksheet) => {
        worksheetCount++;
        console.log(`Processing worksheet: ${worksheet.name}`);
        let rowCount = 0;
        let headers = [];

        worksheet.on("row", (row) => {
          rowCount++;

          // Convert row to object
          const rowObject = {};
          row.eachCell((cell, colNumber) => {
            // Use first row as headers
            if (rowCount === 1) {
              headers[colNumber] = cell.value || `Column${colNumber}`;
            } else {
              const header = headers[colNumber];
              if (header) {
                rowObject[header] = cell.value;
              }
            }
          });

          // Add to JSON data (skip header row)
          if (rowCount > 1 && Object.keys(rowObject).length > 0) {
            jsonData.push(rowObject);
          }

          // Progress reporting
          if (rowCount % 1000 === 0) {
            console.log(`   Processed ${rowCount} rows...`);
          }
        });

        worksheet.on("end", () => {
          console.log(
            `✅ Finished processing worksheet: ${worksheet.name} (${rowCount} rows)`
          );
        });
      });

      workbookReader.on("end", () => {
        console.log(
          `🎉 Excel processing complete! Total worksheets: ${worksheetCount}`
        );

        // Write JSON data to file
        fs.writeFileSync(
          jsonFilePath,
          JSON.stringify(jsonData, null, 2),
          "utf-8"
        );
        console.log(`✅ Converted ${excelFilePath} to ${jsonFilePath}`);
        console.log(`   Total records: ${jsonData.length}`);
        resolve(jsonData);
      });

      workbookReader.on("error", (error) => {
        console.error("❌ Error reading Excel file:", error);
        reject(error);
      });

      workbookReader.read();
    });
  } catch (error) {
    console.error("❌ Conversion failed:", error);
    throw error;
  }
}

export default excelToJSONStream;
