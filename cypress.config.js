const { defineConfig } = require("cypress");

module.exports = defineConfig({
  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    charts: true,
    reportPageTitle: "Reporte de Pruebas E2E",
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
    code: false,
    showPassed: true,
    showFailed: true,
    showPending: false,
    showSkipped: false,
  },
  e2e: {
    video: true,
    screenshotOnRunFailure: true,
    allowCypressEnv: false,
    setupNodeEvents(on, config) {
      require("cypress-mochawesome-reporter/plugin")(on);
      return config;
    },
  },
});
