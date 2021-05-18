import { homedir } from "os";
import path from "path";

const rootDir = path.join(homedir(), ".frontside");
const certificatesDir = path.join(rootDir, "certs");
const selfSignedPemFile = path.join(certificatesDir, "localhost.pem");
const publicDir = path.join(rootDir, "public");
const loginHtmlFile = path.join(publicDir, "login.html");

const projectDir = process.cwd();

const configurationFile = path.join(projectDir, ".simulation-clirc.json");

export const paths = {
  rootDir,
  certificatesDir,
  configurationFile,
  selfSignedPemFile,
  publicDir,
  loginHtmlFile,
} as const;
