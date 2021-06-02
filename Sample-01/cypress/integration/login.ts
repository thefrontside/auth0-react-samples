import type { Client, Scenario, Simulation } from '@simulacrum/client';
import { createClient } from '@simulacrum/client'

interface Person { email: string; password: string }

describe('login', () => {
  let client: Client;
  let simulation: Simulation;
    
  before(async () => {
    client = createClient('http://localhost:4000');
  });

  beforeEach(async () => {
    simulation = await client.createSimulation("auth0");
  });
 
  describe('Universal Login', () => {
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
    
    it('should login', async () => {
      let { data } = await client.given(simulation, "person") as Scenario<Person>;
      let person =  data;
      
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
  })

  describe('normal flow', () => {
    it('should get token without signing in and access restricted route',  async () => {
      let { data } = await client.given(simulation, "person") as Scenario<Person>;
      let person =  data;
      
      cy.login({currentUser: person.email});
  
      cy.visit('/external-api');
  
      cy.url().should('include', '/external-api');
    });
  })
});