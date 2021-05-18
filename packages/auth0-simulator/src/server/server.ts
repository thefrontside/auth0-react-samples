import type { Resource } from "effection";
import type { Server } from "core";
import { createServer, paths, logger } from "core";
import fs from "fs";
import https, { ServerOptions } from "https";
import path from "path";
import { createAuth0Express } from "./createAuth0Express";
import { Auth0SimulatorOptions } from "./types";

export function createAuth0Simulator({
  oauth,
  url,
}: Auth0SimulatorOptions): Resource<Server> {
  return {
    *init() {
      const app = createAuth0Express({
        oauth,
        url,
      });

      const ssl: ServerOptions = {
        key: fs.readFileSync(
          path.join(paths.certificatesDir, "localhost-key.pem")
        ),
        cert: fs.readFileSync(paths.selfSignedPemFile),
      };

      const httpsServer = https.createServer(ssl, app);

      return yield createServer(httpsServer, {
        url,
        onListening: (actualUrl) =>
          logger.start(`🔑 Auth0 simulation server running on ${actualUrl}`),
      });
    },
  };
}
