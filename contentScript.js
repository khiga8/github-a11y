/* ATTENTION: Based on heading position preference, swap `addHeadingToBack` with `addHeadingToFront` in line 45. */

/* Places heading at end of line */
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

function appendAccessibilityInfo() {
  const elements = document.querySelectorAll(
    ".github-a11y-heading-prefix, .github-a11y-img-caption"
  );
  for (const element of elements) {
    element.remove();
  }

  document.querySelectorAll(".markdown-body").forEach(function (commentBody) {
    // Adds alt image overlay. This is hidden from accesibility tree.
    commentBody.querySelectorAll("img").forEach(function (image) {
      let altText = image.getAttribute("alt");
      if (!image.hasAttribute("alt")) {
        image.classList.add("github-a11y-img-missing-alt");
      } else {
        const parentElement = image.parentElement;
        if (!parentElement) return;

        const subtitle = document.createElement("span");
        subtitle.classList.add("github-a11y-img-caption");

        if (altText === "") {
          altText = "hidden";
          subtitle.classList.add("github-a11y-img-caption-empty-alt");
        } else {
          subtitle.classList.add("github-a11y-img-caption-with-alt");
        }
        parentElement.classList.add("github-a11y-img-container");

        subtitle.setAttribute("aria-hidden", "true");
        subtitle.textContent = altText;

        image.insertAdjacentElement("afterend", subtitle);
      }
    });

    // Appends heading level to headings. This is hidden from accesibility tree
    commentBody
      .querySelectorAll("h1, h2, h3, h4, h5, h6")
      .forEach(function (heading) {
        const headingPrefix = document.createElement("span");
        headingPrefix.setAttribute("aria-hidden", "true");

        addHeadingToBack(heading, headingPrefix); // Swappable with `addHeadingToFront`
      });
  });
}

/* Listen for messages from the background script */
chrome.runtime.onMessage.addListener((request, sendResponse) => {
  if (request === "activeElement") {
    sendResponse({ response: document });
  } else {
    appendAccessibilityInfo();
  }
});

appendAccessibilityInfo();

const observer = new MutationObserver(function (mutationList) {
  for (const mutation of mutationList) {
    if (
      mutation.target.matches(".markdown-body") ||
      mutation.target.matches(".js-commit-preview")
    ) {
      appendAccessibilityInfo();
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

document.addEventListener("turbo:load", () => {
  appendAccessibilityInfo();
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
});

chrome.runtime.onConnect.addListener(function (port) {
  alert("CONNECTED");
  port.onMessage.addListener(function (msg) {
    if (msg.request === "activeElement") {
      port.postMessage({ response: document.activeElement.id });
    }
  });
});
