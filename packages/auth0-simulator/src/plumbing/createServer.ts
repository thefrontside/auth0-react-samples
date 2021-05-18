import assert from "assert-ts";
import type { Task, Resource } from "effection";
import type { Server, ServerOptions } from "../types";
import { once } from "effection";
import { Express } from "express";
import getPort from "get-port";
import type { Server as HTTPServer } from "http";
import { logger } from "../logger/logger";

const PortRegex = /:(?<port>[0-9]+)/;

export function createServer(
  app: Express | HTTPServer,
  options: ServerOptions
): Resource<Server> {
  return {
    *init(scope: Task) {
      const portMatch = options.url.match(PortRegex);

      if (!portMatch?.groups?.port) {
        logger.error(`no port found in url ${options.url}`);
        return;
      }

      const port = yield getPort({ port: Number(portMatch.groups.port) });

      const server = app.listen(port);

      scope.spawn(function* () {
        const error: Error = yield once(server, "error");
        throw error;
      });

      if (!server.listening) {
        yield once(server, "listening");
      }

      const address = server.address();
      assert(!!address && typeof address !== "string", "unexpected address");

      const actualUrl = options.url.replace(PortRegex, `:${address.port}`);

      scope.spawn(function* () {
        try {
          yield;
        } finally {
          server.close();
          logger.done(`server running on ${actualUrl || port} closing.`);
        }
      });

      options?.onListening?.(actualUrl);

      return {
        server,
        address,
      };
    },
  };
}
