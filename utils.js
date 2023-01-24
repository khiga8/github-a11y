export function invalidAltText(altText) {
  const defaultMacOsScreenshotAltRegex =
    /^Screen ?[S|s]hot \d{4}-\d{2}-\d{2} at \d+ \d{2} \d{2} [A|P]M$/gi;
  const imageAltRegex = /^image$/i;
  return Boolean(
    altText.match(defaultMacOsScreenshotAltRegex) ||
      altText.match(imageAltRegex)
  );
}
