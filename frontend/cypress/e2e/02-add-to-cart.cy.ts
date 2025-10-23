describe("Ajouter au panier depuis une fiche produit", () => {
  before(() => {
    cy.resetDb();
  });

  it("ouvre un produit, choisit une variante et ajoute au panier", () => {
    cy.loginUI();

    cy.visit("/products");
    // Ouvre un produit seedé (clique la carte -> navigate('/products/:id'))
    cy.findByText(/Chaussures Rossignol Alltrack Pro/i, {
      timeout: 8000,
    }).click();

    // Sélectionne la première variante (tes radios ont un role implicite, on check le premier)
    cy.get('input[type="radio"]').first().check({ force: true });

    // Les dates ont une valeur par défaut (aujourd'hui→aujourd'hui), on garde
    // Quantity = 1 par défaut

    // Ajouter au panier
    cy.get('[data-testid="add-to-cart"]').click();

    // Aller au panier pour vérifier
    cy.visit("/cart");

    // Vérifie que la page panier s'affiche
    cy.findByText(/Récapitulatif de votre panier de commande/i, {
      timeout: 8000,
    }).should("exist");
    // Et que le produit est bien listé
    cy.findByText(/Chaussures Rossignol Alltrack Pro/i).should("exist");
  });
});
