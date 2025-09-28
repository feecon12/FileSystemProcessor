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
          console.log(`Form ${index + 1}: ${line}`);

          // Process each JSON template item
          jsonData.forEach((item) => {
            const newItem = JSON.parse(JSON.stringify(item));

            // Ensure all items have the same complete structure
            const normalizedItem = {
              "S.no": newItem["S.no"] || "",
              Summary: newItem["Summary"] || "",
              Description: newItem["Description"] || "",
              "Test Type": newItem["Test Type"] || "",
              "Test Step": newItem["Test Step"] || "",
              "Expected Results": newItem["Expected Results"] || "",
              Repository: newItem["Repository"] || "",
            };

            // Process items with S.no field (main test case records)
            if ("S.no" in newItem) {
              normalizedItem["S.no"] = index + 1;
              // Safe string replacement
              if (normalizedItem["Summary"]) {
                normalizedItem["Summary"] = normalizedItem["Summary"]
                  .replace(new RegExp("TC_01", "g"), "TC_" + (index + 1))
                  .replace(new RegExp("FORMNUM", "g"), line);
              }
              if (normalizedItem["Description"]) {
                normalizedItem["Description"] = normalizedItem[
                  "Description"
                ].replace(new RegExp("FORMNUM", "g"), line);
              }
            }

            // Process FORMNUM replacements in Test Step and Expected Results for all items
            if (normalizedItem["Test Step"]) {
              normalizedItem["Test Step"] = normalizedItem["Test Step"].replace(
                new RegExp("FORMNUM", "g"),
                line
              );
            }
            if (normalizedItem["Expected Results"]) {
              normalizedItem["Expected Results"] = normalizedItem[
                "Expected Results"
              ].replace(new RegExp("FORMNUM", "g"), line);
            }

            processedData.push(normalizedItem);
          });
        });

        // Save intermediate JSON
        fs.writeFileSync(
          "output.json",
          JSON.stringify(processedData, null, 2),
          "utf-8"
        );
        console.log(
          `💾 Intermediate JSON saved: output.json (${processedData.length} records)`
        );

        resolve(processedData);
      } catch (parseError) {
        reject(new Error(`Failed to parse JSON: ${parseError.message}`));
      }
    });
  });
}

export default processJSONWithForms;
