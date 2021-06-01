import type { Client, Scenario, Simulation } from '@simulacrum/client';
import { createClient } from '@simulacrum/client'

interface Person { email: string; password: string }

describe('login', () => {
  let client: Client;
  let simulation: Simulation;
  let person: Person;
    
  before(async () => {
    client = createClient('http://localhost:4000');
  });

  afterEach(() => {
    client.destroySimulation(simulation);
  })
  
  beforeEach(async () => {
    simulation = await client.createSimulation("auth0");
    let scenario = await client.given(simulation, "person") as Scenario<Person>;
    person = scenario.data;
  })

  it('should fail login', () => {
    cy.visit('/')

    cy.get('#qsLoginBtn').first().click();

    cy.get('#username')
    .type('bob@gmail.com');

    cy.get('#password')
    .type('sdfsdfsdfsd');

    cy.get('#submit').click();

    cy.get('.nav-link').should('not.exist');
  })
  
  it('should login', () => {
    cy.visit('/')

    cy.get('#qsLoginBtn').first().click();

    cy.get('#username')
    .type(person.email)
    .should('have.value', person.email);

    cy.get('#password')
    .type(person.password)
    .should('have.value', person.password);

    cy.get('#submit').click();

    cy.get('.nav-link').should('contain', 'External API');
  })
  
  it('should get token without logging in and access restricted route',  async () => {
    let { data } = await client.given(simulation, "person") as Scenario<Person>;
    let person2 =  data;
    
    cy.login({currentUser: person2.email});

    cy.visit('/external-api');

    cy.url().should('include', '/external-api');
  });
});