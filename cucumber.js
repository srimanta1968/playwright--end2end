let currentDate = new Date();
let timestamp = `${("0" + (currentDate.getMonth() + 1)).slice(-2)}-${(
  "0" + currentDate.getDate()
).slice(-2)}-T-${currentDate.getHours()}-${currentDate.getMinutes()}`;

console.log(`expected report file should include ${timestamp}`);

let common = [
  "features/login.feature", // Specify our feature files
  "features/shopping.feature", // Specify our feature files
  "features/submitOrder.feature", // Specify our feature files
  "features/submitOrderFailed.feature", // Specify our feature files

  `--require step-definitions/**/*.js`, // Load step definitions
  `--format html:./reports/report-qa-${timestamp}.html`, // Load custom formatter
  // '--format json:report.json'
  // '--format @cucumber/pretty-formatter'
  // '--format progress-bar'
  // '--format message:./reports/report.ndjson'
  // '--fail-fast',
  // `--tags "@test"`,
].join(" ");

module.exports = {
  default: common,
};
