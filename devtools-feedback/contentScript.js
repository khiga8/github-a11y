const getType = (element) => {
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
};

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function (msg) {
    if (msg.request === "getTextAreas") {
      const markdownTextAreas =
        Array.from(document.querySelectorAll("textArea")) || [];
      const results = [];

      const codeMirrors = Array.from(document.querySelectorAll(".CodeMirror"));
      [...markdownTextAreas, ...codeMirrors].forEach((textArea) => {
        // ensure that textArea is not hidden and that the user has typed in a value
        if (textArea.clientWidth && textArea.value) {
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
        textArea.classList.add("github-a11y-highlight");
        textArea.focus();
        textArea.scrollIntoView();
      }
    }
  });
});
