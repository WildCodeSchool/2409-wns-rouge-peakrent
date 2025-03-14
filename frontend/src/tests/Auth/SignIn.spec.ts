// afficher erreur si mauvaise adresse mail
// bouton désactivé si pas d'informations entrés
// Informations envoyées si les informations sont ok

// it('renders with props', () => {
//     const wrapper = render(HelloWorld, {
//       props: { initialMessage: 'Hello, Props!' }
//     });
//     expect(wrapper.text()).toContain('Hello, Props!');
//   });

import { render, screen } from "@testing-library/react";
import { describe, it } from "vitest";
// import App from "../../App";

describe("App", () => {
  it("renders the SignUp component", () => {
    const {test} = render(<SignInPage />);
    screen.debug();
  });
});