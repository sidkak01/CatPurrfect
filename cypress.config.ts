import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "angular",
      bundler: "webpack",
    },
    specPattern: "cypress/component/**/*.cy.ts",
  },
  e2e: {
    baseUrl: 'http://localhost:5000',
    setupNodeEvents(on, config) {
    },
  },
  viewportWidth: 1200,
  viewportHeight: 800,
  video: false,
  screenshotOnRunFailure: true,
  defaultCommandTimeout: 5000,
  // Configuration for Google Maps testing
  chromeWebSecurity: false,
});
