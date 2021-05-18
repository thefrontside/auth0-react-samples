import { paths, createCors } from "core";
import { assert } from "assert-ts";
import cookieSession from "cookie-session";
import express, { json, urlencoded } from "express";
import fs from "fs";
import { createAuth0Routes } from "./auth0Routes";
import { createAuth0Config } from "./configCreator";
import { createUtilityRoutes } from "./createUtilityRoutes";
import { Auth0SimulatorOptions } from "./types";
import { createWellKnownRoutes } from "./wellKnownRoutes";

const twentyFourHours = 24 * 60 * 60 * 1000;

export const createAuth0Express = ({
  url,
  oauth,
}: Auth0SimulatorOptions) => {
  // TODO: Add the known root CA to NODE_EXTRA_CA_CERTS.
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  assert(
    fs.existsSync(paths.loginHtmlFile),
    `no login.html at ${paths.loginHtmlFile}`
  );

  const indexHtmlFile = fs.readFileSync(paths.loginHtmlFile, "utf-8");

  const app = express();

  app.set("trust proxy", 1);
  app.use(
    cookieSession({
      name: "session",
      keys: ["shhh"],
      secure: true,
      httpOnly: false,
      maxAge: twentyFourHours,
      sameSite: "none",
    })
  );

  app.use(createCors());

  app.use((_, res, next) => {
    res.set("Pragma", "no-cache");
    res.set("Cache-Control", "no-cache, no-store");
    next();
  });

  app.use(json());
  app.use(urlencoded({ extended: true }));

  app.get("/heartbeat", (_, res) => res.status(200).json({ ok: true }));

  app.use("/.well-known", createWellKnownRoutes({ url }));

  app.use(createAuth0Routes({ url, oauth }));

  app.use(createUtilityRoutes({ url }));

  app.get("/login", (req, res) => {
    const config = createAuth0Config({
      url,
      ...req.query,
      client_id: oauth.clientID,
      scope: oauth.scope,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const raw = Buffer.from(JSON.stringify(config), "utf8").toString("base64");

    const configuredHtml = indexHtmlFile.replace(/@@config@@/g, raw);

    res.set("Content-Type", "text/html");

    res.status(200).send(Buffer.from(configuredHtml));
  });

  return app;
};
