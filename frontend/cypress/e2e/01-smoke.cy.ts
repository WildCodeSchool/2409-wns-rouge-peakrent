describe("Smoke - Reset + Login + Voir profil + Voir catalogue", () => {
  before(() => {
    cy.resetDb();
  });

  it("se connecte et affiche la liste des produits", () => {
    cy.loginUI();

    cy.url().should("eq", Cypress.config().baseUrl + "/");

    cy.get("header").should("be.visible");
    cy.get('[aria-haspopup="menu"]').click();
    cy.get('[data-slot="dropdown-menu-content"][data-state="open"]', {
      timeout: 10000,
    }).should("be.visible");
    cy.get('[data-slot="dropdown-menu-content"]')
      .contains('[role="menuitem"]', /^Profil$/)
      .click({ force: true });
    cy.findByText(/Mes commandes/i, { timeout: 8000 }).should("exist");

    cy.get('a[aria-label="Navigation vers la page produit"]').click();
    cy.findByText(/Tous les produits/i, { timeout: 8000 }).should("exist");
    cy.findByText(/Chaussures Rossignol Alltrack Pro/i, {
      timeout: 8000,
    }).should("exist");
  });
});
