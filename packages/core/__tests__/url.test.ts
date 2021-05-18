import { ensureTrailingSlash } from "../utils/url";

describe("url util", () => {
  it.each`
    url           | expected
    ${"/"}        | ${"/"}
    ${"/route"}   | ${"/route/"}
    ${"single"}   | ${"single/"}
    ${"double//"} | ${"double/"}
  `("should format $url to $expected", ({ url, expected }) => {
    expect(ensureTrailingSlash(url)).toBe(expected);
  });
});
