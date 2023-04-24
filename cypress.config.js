const { defineConfig } = require("cypress");

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'Strabag Headless Results',
    inlineAssets: true,
    saveAllAttempts: false,
    overwrite: false,
    html: false,
    json: true,
    reportDir: "cypress/reports/mochawesome-report",
  },
  screenshotsFolder: "cypress/reports/mochawesome-report/assets",
  e2e: {
    testIsolation: false,
    baseUrl: "http://trserver:4321/login",
    viewportHeight: 1080,
    viewportWidth: 1920,
    chromeWebSecurity: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
