import configJson from "../../src/auth_config.json";

Cypress.Commands.add('login', (overrides = {}) => {
  Cypress.log({
    name: 'loginViaAuth0',
  });

  const options = {
    method: 'POST',
    url: `https://${configJson.domain}/oauth/token`,
    body: {
      grant_type: 'password',
      username: configJson.username,
      password: "kdjfis*)(*",
      audience: configJson.audience,
      scope: 'openid profile email',
      client_id: configJson.clientId,
      client_secret: "xxxxx",
    },
  };
  cy.request(options);
});