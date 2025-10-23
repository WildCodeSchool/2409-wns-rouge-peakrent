import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:8080",
    specPattern: "cypress/e2e/**/*.cy.ts",
    supportFile: "cypress/support/e2e.ts",
    video: true,
    retries: { runMode: 2, openMode: 0 },
    defaultCommandTimeout: 12000,
    viewportWidth: 1280,
    viewportHeight: 800,
  },
  env: {
    API_URL: "http://localhost:5050",
    TEST_EMAIL: "client@example.com",
    TEST_PASSWORD: "Client12345!",
  },
});
