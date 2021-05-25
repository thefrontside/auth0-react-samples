import type { Client, Scenario, Simulation } from '@simulacrum/client';
import { createClient } from '@simulacrum/client'

describe('login', () => {
  let client: Client;
  let simulation: Simulation;
  let user: { email: string };
  
  before(async () => {
    client = client || createClient('http://localhost:4000');
    simulation = simulation || await client.createSimulation("auth0");
    let scenario = await client.given(simulation, "person") as Scenario<{email: string}>;
    user = scenario.data;
  });

  after(() => {
    client.destroySimulation(simulation);
  })
  
  it('login', () => {
    cy.visit('/')

    cy.get('#qsLoginBtn').first().click();

    cy.get('#username')
    .type(user.email)
    .should('have.value', user.email);

    cy.get('#password')
    .type('123$567')
    .should('have.value', '123$567');

    cy.get('#submit').click();

    cy.get('.nav-link').contains('External API')
  })
  
  it('should access restricted route',  () => {
    cy.login({currentUser: user.email});

    cy.visit('/external-api');

    cy.get('h1').contains('External')
  });
});