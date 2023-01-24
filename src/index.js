import { appendAccessibilityInfo } from "./utils.js";

export async function initialize() {
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
        if (
          (mutation.target.closest(".markdown-body, .js-commit-preview") ||
            mutation.target.querySelector(".markdown-body")) &&
          !mutation.target.classList.contains("github-a11y-heading") &&
          !mutation.target.classList.contains("github-a11y-img-container")
        ) {
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

  observe();

  document.addEventListener("turbo:load", () => {
    appendAccessibilityInfo();
    observe();
  });
}
