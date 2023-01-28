// Dynamic import to get around lack of support for ES modules in content scripts
(async () => {
  const src = chrome.runtime.getURL("src/index.js");
  const contentScript = await import(src);
  contentScript.initialize();
})();
