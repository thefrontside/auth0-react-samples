export const ensureTrailingSlash = (url: string) =>
  url.endsWith("/") ? url.replace(/\/\//g, "/") : `${url}/`;
