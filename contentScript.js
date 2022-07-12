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
function appendAccessibilityInfo() {
  const outdatedElements = document.querySelectorAll(
    ".github-a11y-heading-prefix, .github-a11y-img-caption"
  );
  for (const element of outdatedElements) {
    element.remove();
  }

  document.querySelectorAll(".markdown-body").forEach(function (commentBody) {
    commentBody.querySelectorAll("img").forEach(function (image) {
      const parent = image.closest("a");
      if (!parent || image.closest("animated-image")) return;

      validateImages(parent, image);
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

  if (!image.hasAttribute("alt") || (altText === "" && !parentAriaLabel)) {
    image.classList.add("github-a11y-img-missing-alt");
  } else {
    const subtitle = createSubtitleElement();
    parent.classList.add("github-a11y-img-container");

    if (parentAriaLabel) {
      subtitle.textContent = parentAriaLabel;
    } else {
      subtitle.textContent = altText;
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
    animatedImage.classList.add("github-a11y-img-missing-alt");
  } else {
    const subtitle = createSubtitleElement();
    subtitle.textContent = altText;
    animatedImage.classList.add("github-a11y-img-container");
    animatedImage.appendChild(subtitle);
  }
}

/* Listen for messages from the background script */
chrome.runtime.onMessage.addListener(() => {
  appendAccessibilityInfo();
});

appendAccessibilityInfo();

/* Debounce to avoid redundant appendAccessibilityInfo calls */
let timer;
let observer = new MutationObserver(function (mutationList) {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    for (const mutation of mutationList) {
      observer.disconnect();
      if (mutation.target.closest(".markdown-body, .js-commit-preview")) {
        appendAccessibilityInfo();
      }
      observe();
    }
  }, 100);
});

const observe = () => {
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
};

document.addEventListener("turbo:load", () => {
  appendAccessibilityInfo();
  observe();
});

/** Validating Markdown */

function getType(element) {
  if (
    element.tagName === "TEXTAREA" &&
    element.getAttribute("name").includes("comment")
  ) {
    return "comment";
  }

  if (
    element.tagName === "TEXTAREA" &&
    element.getAttribute("name").includes("issue")
  ) {
    return "issue";
  }
}

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function (msg) {
    if (msg.request === "getTextAreas") {
      const markdownTextAreas =
        Array.from(document.querySelectorAll("textArea")) || [];
      const results = [];

      // TODO: add in CodeMirrors
      // const codeMirrors = Array.from(document.querySelectorAll(".CodeMirror"));
      // [...markdownTextAreas, ...codeMirrors].forEach

      markdownTextAreas.forEach((textArea) => {
        // if the element is not hidden
        if (textArea.clientWidth) {
          results.push({
            textAreaOutput: textArea.value,
            type: getType(textArea),
            id: textArea.id,
          });
        }
      });

      port.postMessage({ results: results });
    } else if (msg.request === "focusComponent") {
      (
        Array.from(document.getElementsByClassName("github-a11y-highlight")) ||
        []
      ).forEach((element) => {
        element.classList.remove("github-a11y-highlight");
      });

      const textArea = document.getElementById(msg.id);
      if (textArea) {
        // We don't have to do this but for now I am highlighting the component
        textArea.classList.add("github-a11y-highlight");
        textArea.focus();
        textArea.scrollIntoView();
      }
    }
  });
});
