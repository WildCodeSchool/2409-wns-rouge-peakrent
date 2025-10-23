Cypress.Commands.add("resetDb", () => {
  const api = Cypress.env("API_URL");
  return cy
    .request({
      method: "POST",
      url: api,
      headers: { "content-type": "application/json" },
      body: { query: "mutation { resetTestData { ok } }" },
    })
    .its("body.data.resetTestData.ok")
    .should("eq", true);
});

Cypress.Commands.add("loginUI", (email?: string, password?: string) => {
  const e = email || Cypress.env("TEST_EMAIL");
  const p = password || Cypress.env("TEST_PASSWORD");

  cy.visit("/signin");
  cy.contains("h2", /connexion/i).should("exist");
  cy.get('input[name="email"], [data-testid="email"]').first().type(e);
  cy.get('input[name="password"], [data-testid="password"]').first().type(p);
  cy.findByRole("button", { name: /se connecter/i }).click();

  cy.url().should("match", /\/$/);
});
