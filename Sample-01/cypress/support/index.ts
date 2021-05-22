/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      login({ currentUser }: { currentUser: string }): Promise<{access_token: Record<string, any>, expires_in: number, id_token: Record<string, any>}>
    }
  }
}


import './commands'