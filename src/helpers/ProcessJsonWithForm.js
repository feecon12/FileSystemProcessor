import fs from "fs";

// Process JSON data with forms
async function processJSONWithForms(jsonFilePath, formsData) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(jsonFilePath)) {
      reject(new Error(`JSON file not found: ${jsonFilePath}`));
      return;
    }

    fs.readFile(jsonFilePath, "utf-8", (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        const jsonData = JSON.parse(data);
        const processedData = [];

        console.log(
          `🔄 Processing ${jsonData.length} JSON items with ${formsData.length} forms...`
        );

        // Process each form line
        formsData.forEach((line, index) => {
          console.log(`   Form ${index + 1}: ${line}`);

          // Process each JSON template item
          jsonData.forEach((item) => {
            const newItem = JSON.parse(JSON.stringify(item));
            const keyToCheck = "S.no";

            if (keyToCheck in newItem) {
              newItem["S.no"] = index + 1;
              // Safe string replacement
              if (newItem["Summary"]) {
                newItem["Summary"] = newItem["Summary"]
                  .replace(new RegExp("TC_01", "g"), "TC_" + (index + 1))
                  .replace(new RegExp("FORMNUM", "g"), line);
              }
              if (newItem["Description"]) {
                newItem["Description"] = newItem["Description"].replace(
                  new RegExp("FORMNUM", "g"),
                  line
                );
              }
            }

            processedData.push(newItem);
          });
        });

        // Save intermediate JSON
        fs.writeFileSync(
          "TC.json",
          JSON.stringify(processedData, null, 2),
          "utf-8"
        );
        console.log(
          `💾 Intermediate JSON saved: newTC.json (${processedData.length} records)`
        );

        resolve(processedData);
      } catch (parseError) {
        reject(new Error(`Failed to parse JSON: ${parseError.message}`));
      }
    });
  });
}

export default processJSONWithForms;
