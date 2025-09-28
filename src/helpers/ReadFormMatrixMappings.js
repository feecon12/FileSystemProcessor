import ExcelJS from "exceljs";

// Function to read form matrix mappings from Excel
async function readFormMatrixMappings(excelFilePath) {
  console.log(`📋 Reading form matrix mappings from ${excelFilePath}...`);

  const formMappings = {};

  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(excelFilePath);

    const worksheet = workbook.getWorksheet(1); // First worksheet
    let rowCount = 0;
    let headers = [];

    worksheet.eachRow((row, rowNumber) => {
      rowCount++;

      if (rowNumber === 1) {
        // Store headers
        row.eachCell((cell, colNumber) => {
          let headerValue = cell.value;
          // Handle rich text objects
          if (
            headerValue &&
            typeof headerValue === "object" &&
            headerValue.richText
          ) {
            headerValue = headerValue.richText
              .map((part) => part.text)
              .join("");
          }
          headers[colNumber] = headerValue;
        });
        console.log(`📋 Headers found: ${headers.filter((h) => h).join(", ")}`);
        return;
      }

      // Data rows
      const formNumber = row.getCell(1).value;
      if (formNumber) {
        const editionDate = row.getCell(2).value;
        const formName = row.getCell(3).value;
        const stateAvailable = row.getCell(4).value;
        const triggeringCondition = row.getCell(5).value;

        // Extract text from rich text if needed
        const extractText = (value) => {
          if (value && typeof value === "object" && value.richText) {
            return value.richText.map((part) => part.text).join("");
          }
          return value || "";
        };

        formMappings[extractText(formNumber)] = {
          FORMNAME: extractText(formName),
          EDITION: extractText(editionDate),
          STATE: extractText(stateAvailable),
          TRIGGERING_CONDITION: extractText(triggeringCondition),
        };

        console.log(
          `   📝 ${extractText(formNumber)} → ${extractText(
            formName
          )} (${extractText(stateAvailable)})`
        );
      }
    });

    console.log(
      `✅ Loaded ${Object.keys(formMappings).length} form matrix mappings`
    );
    return formMappings;
  } catch (error) {
    console.error("❌ Failed to read form matrix mappings:", error.message);
    return {};
  }
}

export { readFormMatrixMappings };
