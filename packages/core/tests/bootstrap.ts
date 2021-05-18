import { run } from "effection";
import { existsSync } from "fs";
import { paths } from "../config/paths";
import { getAuth0Configuration } from "../install/get-auth0-configuration";

export default async function bootstrap() {
  await run(function* () {
    if (existsSync(paths.loginHtmlFile)) {
      return;
    }

    yield getAuth0Configuration();
  });
}
