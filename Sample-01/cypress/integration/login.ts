describe('login', () => {
  it('login', () => {
    cy.visit('/')

    cy.get('#qsLoginBtn').first().click();

    cy.get('#username')
    .type('bob@gmail.com')
    .should('have.value', 'bob@gmail.com');

    cy.get('#password')
    .type('123$567')
    .should('have.value', '123$567');

    cy.get('#submit').click();

    cy.get('.nav-link').contains('External API')
  })
  
  it('should access restricted route',  () => {
    cy.login({currentUser: 'bob@gmail.com'});

    cy.visit('/external-api');

    cy.get('h1').contains('External')
  });
});