import { ensureTrailingSlash } from "core";
import { Auth0Config } from "./types";

export const createAuth0Config = ({
  url,
  redirect_uri,
  state,
  client_id,
  scope,
  ...rest
}: Auth0Config) => {
  return {
    assetsUrl: "",
    auth0Domain: url.replace(/(^\w+:|^)\/\//, ""),
    auth0Tenant: "frontside",
    clientConfigurationBaseUrl: "https://cdn.auth0.com/",
    callbackOnLocationHash: false,
    callbackURL: redirect_uri,
    cdn: "https://cdn.auth0.com/",
    clientID: client_id,
    dict: {
      signin: {
        title: "Frontside",
      },
    },
    extraParams: {
      ...rest,
      protocol: "oauth2",
      audience: "https://frontside.auth0.com/api/v1/",
      scope,
      response_type: "code",
      response_mode: "query",
      state,
    },
    internalOptions: {
      ...rest,
      protocol: "oauth2",
      audience: "https://frontside.auth0.com/api/v1/",
      scope,
      response_type: "code",
      response_mode: "query",
      state,
    },
    widgetUrl: "https://cdn.auth0.com/w2/auth0-widget-5.1.min.js",
    isThirdPartyClient: false,
    authorizationServer: {
      url,
      issuer: ensureTrailingSlash(url),
    },
    colors: {
      page_background: "#ededed",
      primary: "#032a3b",
    },
  };
};
