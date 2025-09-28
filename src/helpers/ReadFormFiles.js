import fs from "fs";
const formsFilePath = "../../forms.txt";

// Helper function to read forms file
function readFormsFile(formsFilePath) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(formsFilePath)) {
      console.warn(
        `⚠️  Forms file not found: ${formsFilePath}. Using default form.`
      );
      resolve(["FORM001"]); // Default form if file doesn't exist
      return;
    }

    fs.readFile(formsFilePath, "utf-8", (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      const lines = data
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "");

      console.log(`📄 Read ${lines.length} forms from file`);
      if (lines.length === 0) {
        console.warn("⚠️  No forms found in file, using default form.");
        resolve(["FORM001"]);
      } else {
        resolve(lines);
      }
    });
  });
}

export { readFormsFile };
