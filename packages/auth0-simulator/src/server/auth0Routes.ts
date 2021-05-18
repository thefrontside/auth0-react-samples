import { ensureTrailingSlash, expiresAt } from "core";
import assert from "assert-ts";
import { decode, encode } from "base64-url";
import { Router, urlencoded } from "express";
import querystring from "querystring";
import { createJsonWebToken } from "./createJWT";
import { Auth0QueryParams, Auth0SimulatorOptions } from "./types";
import { userNamePasswordForm } from "./usernamepassword";
import { webMessage } from "./webMessage";

const nonceMap: Record<
  string,
  {
    username: string;
    nonce: string;
  }
> = {};

export const createAuth0Routes = ({
  oauth,
  url,
}: Pick<Auth0SimulatorOptions, "oauth" | "url">) => {
  const router = Router();

  router.get("/authorize", (req, res) => {
    const {
      client_id,
      redirect_uri,
      scope,
      state,
      nonce,
      response_mode,
      code_challenge,
      code_challenge_method,
      auth0Client,
      response_type,
      contactEmail,
    } = req.query as Auth0QueryParams & { contactEmail?: string };

    assert(!!req.session, "no session");

    if (typeof contactEmail !== "undefined") {
      req.session.username = contactEmail;
    }

    res.removeHeader("X-Frame-Options");

    if (response_mode === "web_message") {
      const username = req.session.username;

      assert(!!username, `no username in authorise`);

      res.set("Content-Type", "text/html");

      const message = webMessage({
        code: encode(`${nonce}:${username}`),
        state,
        redirect_uri,
        nonce,
      });

      return res.status(200).send(Buffer.from(message));
    }

    return res.status(302).redirect(
      `/login?${querystring.stringify({
        state,
        redirect_uri,
        client: client_id,
        protocol: "oauth2",
        scope,
        response_type,
        response_mode,
        nonce,
        code_challenge,
        code_challenge_method,
        auth0Client,
        audience: "https://frontside.auth0.com/api/v1/",
      })}`
    );
  });

  router.get("/u/login", (_, res) => {
    res.status(200).redirect(`/login`);
  });

  router.post("/usernamepassword/login", (req, res) => {
    const { username, nonce } = req.body;

    assert(!!req.session, "no session");

    req.session.username = username;

    nonceMap[nonce] = {
      username,
      nonce,
    };

    return res.status(200).send(userNamePasswordForm(req.body));
  });

  router.post("/login/callback", urlencoded({ extended: true }), (req, res) => {
    const wctx = JSON.parse(req.body.wctx);

    const { redirect_uri, state, nonce } = wctx;

    assert(!!req.session, "no session");

    const encodedNonce = encode(`${nonce}:${req.session.username}`);

    const qs = querystring.stringify({ code: encodedNonce, state, nonce });

    const routerUrl = `${redirect_uri}?${qs}`;

    return res.status(302).redirect(routerUrl);
  });

  router.post("/oauth/token", function (req, res) {
    const { client_id, code } = req.body;

    const [nonce, username] = decode(code).split(":");

    if (!username) {
      return res.status(400).send(`no nonce in store for ${code}`);
    }

    const idToken = createJsonWebToken({
      alg: "RS256",
      typ: "JWT",
      iss: ensureTrailingSlash(url),
      exp: expiresAt(),
      iat: Date.now(),
      mail: username,
      aud: client_id,
      sub: "subject field",
      nonce,
    });

    return res.status(200).json({
      access_token: createJsonWebToken({}),
      id_token: idToken,
      scope: oauth.scope,
      expires_in: 86400,
      token_type: "Bearer",
    });
  });

  router.get("/v2/logout", (req, res) => {
    req.session = null;
    res.redirect(req.query?.returnTo as string);
  });

  router.get("/api/v2/jobs/verification-email", (_req, res) => res.json({}));
  router.post("/api/v2/users-by-email", (_req, res) => res.json({}));
  router.post("/userinfo", (_req, res) => res.json({}));
  router.post("/dbconnections/change_password", (_req, res) => res.json({}));
  router.post("/dbconnections/signup", (_req, res) => res.json({}));

  return router;
};
