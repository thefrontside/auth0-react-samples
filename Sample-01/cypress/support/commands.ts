import configJson from "../../src/auth_config.json";
import { Auth0Client } from '@auth0/auth0-spa-js';
import Cookies from 'es-cookies';

const auth0Client = new Auth0Client({
  audience: configJson.audience,
  client_id: configJson.clientId,
  connection: 'Username-Password-Authentication',
  domain: configJson.domain,
  scope: 'openid profile email',
  cacheLocation: 'memory',
});

export function saveCookie<T>(
  key: string,
  value: T,
  options: { daysUntilExpire: number } = { daysUntilExpire: 1 }
): void {
  const cookieAttributes: Cookies.CookieAttributes = {};
  cookieAttributes.expires = options.daysUntilExpire;
  Cookies.set(key, JSON.stringify(value), cookieAttributes);
}


Cypress.Commands.add('login', async ({currentUser}: {currentUser: string}) => {
  Cypress.log({
    name: 'loginViaAuth0',
  });

  saveCookie('auth0.is.authenticated', true);

  await auth0Client.getTokenSilently({ ignoreCache: true, currentUser });
});