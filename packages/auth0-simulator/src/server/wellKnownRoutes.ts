import { Router } from "express";
import urlJoin from "url-join";

export const createWellKnownRoutes = ({ url }: { url: string }) => {
  const wellKnownRouter = Router();

  wellKnownRouter.get("/jwks.json", (_req, res) => {
    res.json(JWKS);
  });

  wellKnownRouter.get("/openid-configuration", (_req, res) => {
    res.json({
      issuer: url,
      authorization_endpoint: urlJoin(url, "authorize"),
      token_endpoint: urlJoin(url, "oauth", "token"),
      userinfo_endpoint: urlJoin(url, "userinfo"),
      jwks_uri: urlJoin(url, ".well-known", "jwks.json"),
    });
  });

  return wellKnownRouter;
};
