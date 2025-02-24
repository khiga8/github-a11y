import { appendAccessibilityInfo } from "./utils.js";

export async function initialize() {
  /* Listen for messages from the background script */
  chrome.runtime.onMessage.addListener((message, sendResponse) => {
    if (message.type === "navigation") {
      sendResponse({ status: "ok" });
      appendAccessibilityInfo();
    }
  });

  appendAccessibilityInfo();

  /* Debounce to avoid redundant appendAccessibilityInfo calls */
  let timer;
  let observer = new MutationObserver(function (mutationList) {
    if (timer) clearTimeout(timer);
    observer.disconnect();
    timer = setTimeout(() => {
      for (const mutation of mutationList) {
        if (
          (mutation.target.closest(".markdown-body, .js-commit-preview") ||
            mutation.target.querySelector(".markdown-body")) &&
          !mutation.target.classList.contains("github-a11y-heading") &&
          !mutation.target.classList.contains("github-a11y-img-container")
        ) {
          appendAccessibilityInfo();
        }
      }
    }, 100);
    observe();
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
