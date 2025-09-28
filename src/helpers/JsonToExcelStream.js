import processJSONWithForms from "./ProcessJsonWithForm.js";
import { readFormsFile } from "./ReadFormFiles.js";
import { writeExcelStream } from "./WriteExcel.js";

// Function to convert JSON file to Excel with streaming
async function jsonToExcelStream(
  jsonFilePath,
  excelFilePath,
  formsFilePath
) {
  console.log(
    `📊 Converting ${jsonFilePath} to ${excelFilePath} with streaming...`
  );

  try {
    // Step 1: Read and process forms data
    const formsData = await readFormsFile(formsFilePath);
    console.log(`📝 Forms to process: ${formsData.length}`);

    // Step 2: Process JSON data with forms
    const processedData = await processJSONWithForms(jsonFilePath, formsData);

    // Step 3: Write to Excel
    await writeExcelStream(processedData, excelFilePath);

    console.log(`✅ JSON converted to Excel successfully: ${excelFilePath}`);
  } catch (error) {
    console.error("❌ Conversion failed:", error);
    throw error;
  }
}

export default jsonToExcelStream;
