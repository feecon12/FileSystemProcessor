import processJSONWithForms from "./ProcessJsonWithForm.js";
import { readFormsFile } from "./ReadFormFiles.js";
import { readFormMatrixMappings } from "./ReadFormMatrixMappings.js";
import { writeExcelStream } from "./WriteExcel.js";

// Function to convert JSON file to Excel with enhanced form matrix processing
async function jsonToExcelStream(
  jsonFilePath,
  excelFilePath,
  formsFilePath,
  formMatrixFilePath = "formMatrix.xlsx"
) {
  console.log(
    `� Converting ${jsonFilePath} to ${excelFilePath} with streaming...`
  );

  try {
    // Step 1: Read and process forms data
    const formsData = await readFormsFile(formsFilePath);
    console.log(`📝 Forms to process: ${formsData.length}`);

    // Step 2: Read form matrix mappings
    const formMatrixMappings = await readFormMatrixMappings(formMatrixFilePath);
    console.log(
      `🗂️ Form matrix mappings loaded: ${
        Object.keys(formMatrixMappings).length
      }`
    );

    // Step 3: Process JSON data with forms and matrix mappings
    const processedData = await processJSONWithForms(
      jsonFilePath,
      formsData,
      formMatrixMappings
    );

    // Step 4: Write to Excel
    await writeExcelStream(processedData, excelFilePath);

    console.log(`✅ JSON converted to Excel successfully: ${excelFilePath}`);
  } catch (error) {
    console.error("❌ Conversion failed:", error);
    throw error;
  }
}

export default jsonToExcelStream;
