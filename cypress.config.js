const { defineConfig } = require("cypress");
const { verifyDownloadTasks } = require('cy-verify-downloads');

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'RITBA Headless Results',
    inlineAssets: true,
    saveAllAttempts: false,
    overwrite: false,
    html: false,
    json: true,
    reportDir: "cypress/reports/mochawesome-report",
  },
  screenshotsFolder: "cypress/reports/mochawesome-report/assets",
  e2e: {
    numTestsKeptInMemory: 0,
    defaultCommandTimeout: 10000,
    testIsolation: false,
    baseUrl: "http://trserver:4321/login",
    viewportHeight: 1080,
    viewportWidth: 1920,
    chromeWebSecurity: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', verifyDownloadTasks);
    },
  },
});
