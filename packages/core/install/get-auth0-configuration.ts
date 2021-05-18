import { logger } from "../logger/logger";
import { assert } from "assert-ts";
import { existsSync, promises as fs } from "fs";
import fetch from "node-fetch";
import { paths } from "../config/paths";

export function getAuth0Configuration() {
  return function* () {
    if (!existsSync(paths.publicDir)) {
      logger.info(`creating the public dir ${paths.publicDir}`);
      yield fs.mkdir(paths.publicDir, { recursive: true });
    }

    logger.info("Fetching login.html from auth0-configuration");
    const res = yield fetch(
      "https://api.github.com/reposauth0-configuration/contents/pages/login.html?ref=tenants",
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v4.raw",
        },
      }
    );

    assert(res.ok, "Error downloading login.html");

    const raw = yield res.text();

    yield fs.writeFile(paths.loginHtmlFile, raw);

    assert(
      existsSync(paths.loginHtmlFile),
      `no login.html at ${paths.loginHtmlFile}`
    );

    logger.done(`index.html extracted to ${paths.loginHtmlFile}`);
  };
}
