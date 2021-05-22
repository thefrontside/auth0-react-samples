describe('login', () => {
  it.skip('works', () => {
    cy.visit('/')

    cy.get('#qsLoginBtn').first().click();

    cy.get('#email-address')
    .type('bob@gmail.com')
    .should('have.value', 'bob@gmail.com');

    cy.get('#password')
    .type('123$567')
    .should('have.value', '123$567');

    cy.get('#submit').click();
  })
  
  it('should successfully log into our app',  () => {
    cy.login({currentUser: 'bob@gmail.com'});

    cy.visit('/external-api');

    cy.get('h1').contains('External')
  });
});