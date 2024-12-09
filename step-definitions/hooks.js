const {
  BeforeAll,
  AfterAll,
  Before,
  After,
  setDefaultTimeout,
} = require("@cucumber/cucumber");
const { chromium } = require("playwright");
const { expect } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

// Used to get branch and commit
const exec = require("child_process").exec;

// Set a global timeout of 60 seconds for all steps
setDefaultTimeout(60 * 1000);

// Variables to track scenario counts and failed scenarios
let scenarioCounts = {
  total: 0,
  passed: 0,
  failed: 0,
  skipped: 0,
};

let failedScenarios = [];

/**
 * [this will run before all the tests scripts starts executing]
 */
BeforeAll(async function () {
  console.log("Launching browser...");
  browser = await chromium.launch({
    headless: true, // Run in headless mode
    timeout: timeout,
  });
  context = await browser.newContext();
  await context.setDefaultTimeout(timeout);
  console.log("Opening new page...");
  page = await context.newPage();
});

Before(async function (scenario) {
  // Print feature names while tests are running
  if (featureName !== scenario.gherkinDocument.feature.name) {
    featureName = scenario.gherkinDocument.feature.name;
    console.log(`\n ${featureName}`);
  }
  // Increment the total scenario count
  scenarioCounts.total += 1;
});

After(async function (scenario) {
  console.log(
    `Scenario "${scenario.pickle.name}" status: ${scenario.result.status}`
  );

  // Track scenario results and capture details for failed scenarios
  switch (scenario.result.status.toLowerCase()) {
    case "passed":
      scenarioCounts.passed += 1;
      break;
    case "failed":
      scenarioCounts.failed += 1;
      failedScenarios.push({
        scenario: scenario.pickle.name,
        step: scenario.pickle.steps.map((step) => step.text).join(", "),
        reason: scenario.result.exception
          ? scenario.result.exception.message
          : "Unknown reason",
      });
      break;
    default:
      scenarioCounts.skipped += 1;
  }

  let screenshot;
  if (typeof page !== "undefined") {
    screenshot = await page.screenshot({
      path: `./reports/screenshots/${scenario.pickle.name}.png`,
      timeout: moderateTimeout,
    });
  } else {
    console.log("No instance of page was defined");
  }
  await this.attach(screenshot, "image/png");

  let date = new Date().toISOString().replace("T", " ");
  timestamp = date.substr(0, date.lastIndexOf("."));

  await this.attach(`${timestamp} on branch ${branch} with commit ${commit}`);
});

AfterAll(async function () {
  if (typeof page !== "undefined") {
    await page.close();
  }
  if (typeof context !== "undefined") {
    await context.close();
  }
  if (typeof browser !== "undefined") {
    await browser.close();
  }

  // Write the scenario counts to a JSON file
  const reportPath = path.resolve(
    __dirname,
    "../reports/scenario-summary.json"
  );
  fs.writeFileSync(reportPath, JSON.stringify(scenarioCounts, null, 2));
  console.log(`Scenario summary written to ${reportPath}`);

  // Write failed scenarios to a JSON file
  const failuresPath = path.resolve(__dirname, "../reports/failures.json");
  fs.writeFileSync(failuresPath, JSON.stringify(failedScenarios, null, 2));
  console.log(`Failed scenarios written to ${failuresPath}`);
});
