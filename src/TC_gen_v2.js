import fs from "fs";
import excelToJSONStream from "./helpers/ExcelToJsonProcessor.js";
import jsonToExcelStream from "./helpers/JsonToExcelStream.js";

// Main function
async function TestGen() {
  try {
    console.log("🚀 Starting Excel/JSON conversion process...");

    // Check if input files exist
    const inputExcelFile = "inputTemplate.xlsx";
    const inputJsonFile = "input.json"; // This is actually INPUT JSON despite the name

    if (!fs.existsSync(inputExcelFile)) {
      console.error(`❌ Excel file not found: ${inputExcelFile}`);
      console.log('✨ Please create an Excel file named "inputTemplate.xlsx"');
      return;
    }

    if (!fs.existsSync(inputJsonFile)) {
      console.warn(`⚠️  JSON file not found: ${inputJsonFile}`);
      console.log("� Will only convert Excel to JSON");

      // Convert Excel to JSON only
      await excelToJSONStream(inputExcelFile, "input.json");
    } else {
      // Convert both ways
      await excelToJSONStream(inputExcelFile, "input.json");
      await jsonToExcelStream(
        inputJsonFile,
        "generated-output.xlsx",
        "forms.txt",
        "formMatrix.xlsx"
      );
    }

    console.log("🎉 All conversions completed successfully!");
  } catch (error) {
    console.error("❌ Main process failed:", error.message);
  }
}

// Export functions for use in other modules
export default TestGen;
