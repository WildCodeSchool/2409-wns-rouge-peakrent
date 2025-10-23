describe("Ajouter au panier depuis une fiche produit", () => {
  before(() => {
    cy.resetDb();
  });

  it("ouvre un produit, choisit une variante et ajoute au panier", () => {
    cy.loginUI();

    cy.visit("/products");
    cy.findByText(/Chaussures Rossignol Alltrack Pro/i, {
      timeout: 8000,
    }).click();

    cy.get('input[type="radio"]').first().check({ force: true });

    cy.get('[data-testid="add-to-cart"]').click();

    cy.visit("/cart");

    cy.findByText(/Récapitulatif de votre panier de commande/i, {
      timeout: 8000,
    }).should("exist");
    cy.findByText(/Chaussures Rossignol Alltrack Pro/i).should("exist");
  });
});
