import {
  addHeadingToBack,
  invalidAltText,
  removeOutdatedElements,
} from "../src/utils.js";

describe("invalidAltText", () => {
  test("flags default macOS screenshot", () => {
    expect(invalidAltText("Screenshot 2021-04-16 at 2 22 12 AM")).toBe(true);
    expect(invalidAltText("Screenshot 2018-11-11 at 9 45 54 PM")).toBe(true);
    expect(invalidAltText("Screenshot 2023-04-16 at 12 22 22 AM")).toBe(true);
  });

  test("flags `image` as alt", () => {
    expect(invalidAltText("image")).toBe(true);
    expect(invalidAltText("Image")).toBe(true);
    expect(invalidAltText("IMAGE")).toBe(true);
  });

  test("does not flag alt that contains the macOS screenshot as a substring", () => {
    expect(
      invalidAltText(
        "A file on the desktop that says, `Screenshot 2021-04-16 at 2 22 12 AM`"
      )
    ).toBe(false);
  });

  test("does not flag alt that contains `image` as a substring", () => {
    expect(invalidAltText("pilgrimage")).toBe(false);
    expect(
      invalidAltText("A large image of a dog is projected on the wall")
    ).toBe(false);
  });
});

describe("removeOutdatedElements", () => {
  test("ensure that elements with '.github-a11y-img-container' or 'github-a11y-img-caption' are removed", () => {
    document.body.innerHTML = `
      <div class="outdated">
        <h1>Heading 1 <span aria-hidden="true" class="github-a11y-heading-prefix">h1</span></h1>
        <div class="github-a11y-img-container">
          <img alt="Cute dog" />
          <span class="github-a11y-img-caption">Cute dog</span>
        </div>
        <div class="github-a11y-img-container">
          <img alt="Cute cat" />
          <span class="github-a11y-img-caption">Cute cat</span>
        </div>
      </div>
    `;
    expect(
      document.querySelectorAll(
        ".github-a11y-heading-prefix, .github-a11y-img-caption"
      ).length
    ).toBe(3);
    removeOutdatedElements();
    expect(
      document.querySelectorAll(
        ".github-a11y-heading-prefix, .github-a11y-img-caption"
      ).length
    ).toBe(0);
  });
});

describe("addHeadingToBack", () => {
  test("ensure heading prefix is placed at end of heading", () => {
    document.body.innerHTML = `
      <h1 id="dog-facts">Dog facts</h1>
    `;
    const headingPrefix = document.createElement("span");
    headingPrefix.setAttribute("aria-hidden", "true");
    addHeadingToBack(document.querySelector("#dog-facts"), headingPrefix);

    const heading = document.querySelector("#dog-facts");
    expect(heading.innerHTML).toBe(
      'Dog facts<span aria-hidden="true" class="github-a11y-heading-prefix github-a11y-heading-prefix-after"> h1</span>'
    );
  });
});
