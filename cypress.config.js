const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    testIsolation: false,
    baseUrl: "http://trserver:xxxx",
    viewportHeight: 1080,
    viewportWidth: 1920,
    chromeWebSecurity: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
