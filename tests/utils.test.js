import { invalidAltText } from "../utils.js";

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
