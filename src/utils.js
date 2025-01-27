export function invalidAltText(altText) {
  const defaultMacOsScreenshotAltRegex =
    /^Screen ?[S|s]hot \d{4}-\d{2}-\d{2} at \d+ \d{2} \d{2} [A|P]M$/gi;
  const imageAltRegex = /^image$/i;
  return Boolean(
    altText.match(defaultMacOsScreenshotAltRegex) ||
      altText.match(imageAltRegex)
  );
}

export function removeOutdatedElements() {
  const outdatedElements = document.querySelectorAll(
    ".github-a11y-heading-prefix, .github-a11y-img-caption"
  );
  for (const element of outdatedElements) {
    element.remove();
  }
}

/* Append accessibility info to DOM */
export function appendAccessibilityInfo() {
  removeOutdatedElements();

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

/* Default. Places heading at end of line */
export function addHeadingToBack(heading, headingPrefix) {
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

export function validateImages(parent, image) {
  if (parent.nodeName === "A") {
    validateImagesWithAnchorParent(parent, image);
  } else {
    validateImagesWithNonAnchorParent(parent, image);
  }
}

function validateImagesWithAnchorParent(parent, image) {
  const hasAltTextAttribute = image.hasAttribute("alt");
  const altText = image.getAttribute("alt");
  let parentAriaLabelText;

  // Figure out parent aria-label or aria-labelledby text, if it exists
  if (parent.hasAttribute("aria-label")) {
    parentAriaLabelText = parent.getAttribute("aria-label").trim();
  } else if (parent.hasAttribute("aria-labelledby")) {
    const ariaLabelledByElement = document.getElementById(
      parent.getAttribute("aria-labelledby")
    );
    if (ariaLabelledByElement) {
      parentAriaLabelText = ariaLabelledByElement.textContent.trim();
    }
  }

  if (!hasAltTextAttribute && !parentAriaLabelText) {
    image.classList.add("github-a11y-img-invalid-alt");
    return;
  } else if (hasAltTextAttribute && altText === "" && !parentAriaLabelText) {
    image.classList.add("github-a11y-img-invalid-alt");
    return;
  }

  if (altText && invalidAltText(altText)) {
    image.classList.add("github-a11y-img-invalid-alt");
  } else if (parentAriaLabelText && invalidAltText(parentAriaLabelText)) {
    image.classList.add("github-a11y-img-invalid-alt");
  }

  if (parent.querySelector('.github-a11y-img-caption')) {
    return;
  }
  const subtitle = createSubtitleElement();
  parent.classList.add("github-a11y-img-container");

  subtitle.textContent = parentAriaLabelText || altText;
  image.insertAdjacentElement("afterend", subtitle);
}

function validateImagesWithNonAnchorParent(parent, image) {
  const isEmoji = image.classList.contains("emoji");
  if (isEmoji) {
    return;
  }

  const hasAltTextAttribute = image.hasAttribute("alt");
  const altText = hasAltTextAttribute && image.getAttribute("alt").trim();
  if (!hasAltTextAttribute) {
    image.classList.add("github-a11y-img-invalid-alt");
    return;
  }
  if (invalidAltText(altText)) {
    image.classList.add("github-a11y-img-invalid-alt");
  }
  if (parent.querySelector('.github-a11y-img-caption')) {
    return;
  }
  const subtitle = createSubtitleElement();
  parent.classList.add("github-a11y-img-container");

  subtitle.textContent = altText;

  if (subtitle.textContent == "") {
    subtitle.textContent = "hidden";
    subtitle.classList.add("github-a11y-img-caption-empty-alt");
  }
  image.insertAdjacentElement("afterend", subtitle);
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
