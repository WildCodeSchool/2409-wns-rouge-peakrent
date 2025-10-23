export {};

declare global {
  namespace Cypress {
    interface Chainable {
      resetDb(): Chainable<void>;
      loginUI(email?: string, password?: string): Chainable<void>;
    }
  }
}
