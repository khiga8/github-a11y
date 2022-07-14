import {
  LEVEL_1_HEADING_REGEX,
  LINK_REGEX,
  INNER_LINK_REGEX,
  disableButton,
  enableButton,
  invalidLinks,
} from "../utils";

describe("Regex", () => {
  test("LEVEL_1_HEADING_REGEX", () => {
    const testCase1 = "# h1".match(LEVEL_1_HEADING_REGEX);
    expect(testCase1).toEqual(["# "]);

    const testCase2 = "## h2".match(LEVEL_1_HEADING_REGEX);
    expect(testCase2).toEqual(null);

    const testCase3 = "#something thats not a heading".match(
      LEVEL_1_HEADING_REGEX
    );
    expect(testCase3).toEqual(null);

    const testCase4 = " # space in front".match(LEVEL_1_HEADING_REGEX);
    expect(testCase4).toEqual([" # "]);

    const testCase5 = "something else thats not a heading#lalal".match(
      LEVEL_1_HEADING_REGEX
    );
    expect(testCase5).toEqual(null);
  });

  test("LINK_REGEX", () => {
    const testCase1 = "<a>A link</a>".match(LINK_REGEX);
    expect(testCase1).toEqual(["<a>A link</a>"]);

    const testCase2 = "<div>not a link</div>".match(LINK_REGEX);
    expect(testCase2).toEqual(null);

    const testCase3 = "<a class='link' href='google.com'>A link</a>".match(
      LINK_REGEX
    );
    expect(testCase3).toEqual(["<a class='link' href='google.com'>A link</a>"]);

    const testCase4 = "<a class='link'>A link</a>".match(LINK_REGEX);
    expect(testCase4).toEqual(["<a class='link'>A link</a>"]);

    const testCase5 = "<a class='link'>A link</a".match(LINK_REGEX);
    expect(testCase5).toEqual(null);
  });

  test("INNER_LINK_REGEX", () => {
    const testCase1 = "<a>A link</a>".match(INNER_LINK_REGEX);
    expect(testCase1).toEqual(["A link"]);

    const testCase2 = "<div>not a link</div>".match(INNER_LINK_REGEX);
    expect(testCase2).toEqual(null);

    const testCase3 =
      "<a class='link' href='google.com'>descriptive link</a>".match(
        INNER_LINK_REGEX
      );
    expect(testCase3).toEqual(["descriptive link"]);

    const testCase4 = "<a class='link'>a link</a>".match(INNER_LINK_REGEX);
    expect(testCase4).toEqual(["a link"]);
  });
});

describe("Button Helpers", () => {
  test("disableButton", () => {
    const button = { ariaDisabled: false, disabled: false };
    disableButton(button);

    expect(button.ariaDisabled).toBe(true);
    expect(button.disabled).toBe(true);
  });

  test("enableButton", () => {
    const button = { ariaDisabled: true, disabled: true };
    enableButton(button);

    expect(button.ariaDisabled).toBe(false);
    expect(button.disabled).toBe(false);
  });
});

describe("invalidLinks", () => {
  test("all links are valid", () => {
    const links = ["<a>A very descriptive link</a>"];
    const results = invalidLinks(links);

    expect(results).toStrictEqual([]);
  });

  test("Upper case strings are converted to lower case", () => {
    const links = ["<a>Learn more</a>"];
    const results = invalidLinks(links);

    expect(results).toStrictEqual(["<a>Learn more</a>"]);
  });

  test("all links are invalid", () => {
    const links = ["<a>Learn more</a>", "<a>learn more</a>"];
    const results = invalidLinks(links);

    expect(results).toStrictEqual(["<a>Learn more</a>", "<a>learn more</a>"]);
  });
});
