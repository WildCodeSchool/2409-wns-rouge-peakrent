// Bouton désactivé si pas d'informations entrées
// vérifier l'envoi des informations à l'API si tout est ok
// afficher message d'erreur si mot de passe pas assez bien
// afficher erreur si deux mots de passe différent
// afficher erreur si pas d'adresse mail


import { render, screen } from "@testing-library/react";
import { describe, it } from "vitest";
import  SignUpPage from "../../pages/Auth/SignUp";
import * as React from "react"
// import App from "../../App";

describe("App", () => {
  it("renders the SignUp component", () => {
    console.log(SignUpPage)
    render(<SignUpPage />);
    // <SignUpPage />
    screen.debug();
  });
});