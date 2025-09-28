import fs from "fs";

// Process JSON data with forms and form matrix mappings
async function processJSONWithForms(
  jsonFilePath,
  formsData,
  formMatrixMappings = {}
) {
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

        // Validate JSON structure
        if (!Array.isArray(jsonData) || jsonData.length === 0) {
          reject(new Error("JSON data must be a non-empty array"));
          return;
        }

        // Detect template structure dynamically
        const sampleItem = jsonData[0];
        const expectedFields = Object.keys(sampleItem);
        console.log(
          `📋 Detected template structure: ${expectedFields.join(", ")}`
        );

        const processedData = [];
        const warnedMissingForms = new Set(); // Track forms we've already warned about

        console.log(
          `🔄 Processing ${jsonData.length} JSON items with ${formsData.length} forms...`
        );

        // Process each form line
        formsData.forEach((line, index) => {
          // Reduced logging: only log the form being processed without matrix details
          console.log(`📋 Form ${index + 1}: ${line}`);

          // Process each JSON template item
          jsonData.forEach((item) => {
            const newItem = JSON.parse(JSON.stringify(item));

            // Dynamic structure preservation instead of hardcoded fields
            const normalizedItem = {};
            Object.keys(item).forEach((key) => {
              normalizedItem[key] = newItem[key] || "";
            });

            // Process items with S.no field (main test case records) if it exists
            if ("S.no" in newItem) {
              normalizedItem["S.no"] = index + 1;
            }

            // Safe string replacement for all string fields
            Object.keys(normalizedItem).forEach((field) => {
              if (
                normalizedItem[field] &&
                typeof normalizedItem[field] === "string"
              ) {
                // Apply FORMNUM and TC_01 replacements
                normalizedItem[field] = normalizedItem[field]
                  .replace(new RegExp("TC_01", "g"), "TC_" + (index + 1))
                  .replace(new RegExp("FORMNUM", "g"), line);
              }
            });

            // Apply form matrix mappings if available for this form
            if (formMatrixMappings[line]) {
              const mappings = formMatrixMappings[line];
              // Removed individual matrix mapping logging to avoid console spam

              // Apply all form matrix mappings to all fields
              Object.keys(normalizedItem).forEach((field) => {
                if (
                  normalizedItem[field] &&
                  typeof normalizedItem[field] === "string"
                ) {
                  Object.keys(mappings).forEach((placeholder) => {
                    const value = mappings[placeholder];
                    if (value) {
                      // Only replace if value exists
                      normalizedItem[field] = normalizedItem[field].replace(
                        new RegExp(placeholder, "g"),
                        value
                      );
                    }
                  });
                }
              });
            } else {
              // Warn about missing mapping but continue processing (only once per form)
              if (!warnedMissingForms.has(line)) {
                console.warn(
                  `⚠️  No form matrix mapping found for form: ${line}`
                );
                const availableForms = Object.keys(formMatrixMappings);
                if (availableForms.length > 7) {
                  console.warn(
                    `   📋 Available forms: ${availableForms
                      .slice(0, 10)
                      .join(", ")}... (${availableForms.length - 10} more)`
                  );
                } else {
                  console.warn(
                    `   📋 Available forms: ${availableForms.join(", ")}`
                  );
                }
                console.warn(
                  `   🔄 Placeholders FORMNAME, EDITION, STATE, TRIGGERING_CONDITION will remain unchanged`
                );
                warnedMissingForms.add(line);
              }
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
