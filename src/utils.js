export function invalidAltText(altText) {
  const defaultMacOsScreenshotAltRegex =
    /^Screen ?[S|s]hot \d{4}-\d{2}-\d{2} at \d+ \d{2} \d{2} [A|P]M$/gi;
  const imageAltRegex = /^image$/i;
  return Boolean(
    altText.match(defaultMacOsScreenshotAltRegex) ||
      altText.match(imageAltRegex)
  );
}

/* Default. Places heading at end of line */
function addHeadingToBack(heading, headingPrefix) {
  headingPrefix.classList.add(
    "github-a11y-heading-prefix",
    "github-a11y-heading-prefix-after"
  );
  headingPrefix.textContent = ` ${heading.tagName.toLowerCase()}`;
  heading.classList.add("github-a11y-heading", "github-a11y-heading-after");
  heading.append(headingPrefix);
}

/* Places heading in front of line */
function addHeadingToFront(heading, headingPrefix) {
  headingPrefix.textContent = `${heading.tagName.toLowerCase()} `;
  headingPrefix.classList.add("github-a11y-heading-prefix");
  heading.classList.add("github-a11y-heading");
  heading.insertBefore(headingPrefix, heading.firstChild);
}

/* Append accessibility info to DOM */
export function appendAccessibilityInfo() {
  const outdatedElements = document.querySelectorAll(
    ".github-a11y-heading-prefix, .github-a11y-img-caption"
  );
  for (const element of outdatedElements) {
    element.remove();
  }

  document.querySelectorAll(".markdown-body").forEach(function (commentBody) {
    commentBody.querySelectorAll("img").forEach(function (image) {
      const parentNodeName = image.parentElement.nodeName;
      if (parentNodeName === "A" || parentNodeName === "P") {
        const parent = image.closest("a") || image.closest("p");
        validateImages(parent, image);
      }
    });

    commentBody
      .querySelectorAll("animated-image")
      .forEach(function (animatedImage) {
        validateImagesInsideAnimatedPlayer(animatedImage);
      });

    commentBody
      .querySelectorAll("h1, h2, h3, h4, h5, h6")
      .forEach(function (heading) {
        const headingPrefix = document.createElement("span");
        headingPrefix.setAttribute("aria-hidden", "true");

        addHeadingToBack(heading, headingPrefix); // Swappable with `addHeadingToFront`
      });
  });
}
function validateImages(parent, image) {
  const altText = image.getAttribute("alt")
    ? image.getAttribute("alt").trim()
    : "";
  const parentAriaLabel =
    parent.getAttribute("aria-label") &&
    parent.getAttribute("aria-label").trim();

  if (
    !image.hasAttribute("alt") ||
    (altText === "" && !parentAriaLabel && parent.nodeName === "A")
  ) {
    image.classList.add("github-a11y-img-invalid-alt");
  } else {
    if (invalidAltText(altText))
      parent.classList.add("github-a11y-img-invalid-alt");
    const subtitle = createSubtitleElement();
    parent.classList.add("github-a11y-img-container");

    if (parentAriaLabel) {
      subtitle.textContent = parentAriaLabel;
    } else if (altText) {
      subtitle.textContent = altText;
    } else {
      subtitle.textContent = "hidden";
      subtitle.classList.add("github-a11y-img-caption-empty-alt");
    }

    image.insertAdjacentElement("afterend", subtitle);
  }
}

function createSubtitleElement() {
  const subtitle = document.createElement("span");
  subtitle.setAttribute("aria-hidden", "true");
  subtitle.classList.add(
    "github-a11y-img-caption",
    "github-a11y-img-caption-with-alt"
  );

  return subtitle;
}

function validateImagesInsideAnimatedPlayer(animatedImage) {
  const image = animatedImage.querySelector("img");
  const altText = image.getAttribute("alt")
    ? image.getAttribute("alt").trim()
    : "";

  if (!image.hasAttribute("alt") || altText === "") {
    animatedImage.classList.add("github-a11y-img-invalid-alt");
  } else {
    const subtitle = createSubtitleElement();
    subtitle.textContent = altText;
    animatedImage.classList.add("github-a11y-img-container");
    animatedImage.appendChild(subtitle);
  }
}
