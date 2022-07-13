const LEVEL_1_HEADING_REGEX = /\#\s/g;
const HELPER_LINKS = {
  headings: "https://www.markdownguide.org/basic-syntax/#headings",
};

const replaceMainContent = (element) => {
  document.getElementById("main").innerHTML = "";
  return document.getElementById("main").append(element);
};

const disableButton = (button) => {
  button.ariaDisabled = "true";
  button.disabled = true;
};

const enableButton = (button) => {
  button.ariaDisabled = "false";
  button.disabled = false;
};

const provideFeedback = (textContent, type) => {
  const hasHeading = textContent && textContent.includes("#");
  if (!hasHeading) {
    return {
      title: "Missing Heading",
      message: `Looks like you haven\'t added any headings to your ${type} body. <a href="${HELPER_LINKS.headings}">Learn how to use Markdown Headings</a>`,
    };
  }

  const usesLevel1Heading = LEVEL_1_HEADING_REGEX.test(textContent);
  if (usesLevel1Heading) {
    return {
      title: "Uses Level 1 Heading",
      message: `Looks like you\'re using a level 1 heading. That\'s already been set on this page. Try using a level two heading or <a href="${HELPER_LINKS.headings}">Learn how to use Markdown Headings</a>`,
    };
  }

  const usesNonDescriptiveLinks = false;
  if (usesNonDescriptiveLinks) {
    return {};
  }

  const usesBadAltText = false;
  if (usesBadAltText) {
    return {};
  }
};

const focus = (id) => {
  chrome.tabs.query(
    {
      active: true,
      lastFocusedWindow: true,
    },
    function (tabs) {
      const port = chrome.tabs.connect(tabs[0].id);
      port.postMessage({ request: "focusComponent", id: id });
    }
  );
};

const validateMarkdown = () => {
  chrome.tabs.query(
    {
      active: true,
      lastFocusedWindow: true,
    },
    function (tabs) {
      const port = chrome.tabs.connect(tabs[0].id);
      const list = document.createElement("ul");

      port.postMessage({ request: "getTextAreas" });

      port.onMessage.addListener((msg) => {
        msg.results.forEach((textArea) => {
          const { textAreaOutput, type, id } = textArea;
          const feedback = provideFeedback(textAreaOutput, type);

          if (feedback) {
            const listItem = document.createElement("li");
            const heading = document.createElement("h2");
            const paragraph = document.createElement("p");
            const highlightButton = document.createElement("button");

            heading.innerHTML = feedback.title;
            paragraph.innerHTML = feedback.message;
            highlightButton.innerText = "Find Component";
            highlightButton.addEventListener("click", () => focus(id));

            listItem.append(heading);
            listItem.append(paragraph);
            listItem.append(highlightButton);
            list.append(listItem);
          }
        });
        if (msg.results.length === 0 || list.innerHTML === "") {
          const heading = document.createElement("h2");
          heading.innerText = "Everything looks good!";
          replaceMainContent(heading);
        } else {
          replaceMainContent(list);
        }
      });
    }
  );
};

const initializePanel = () => {
  const validateMarkdownButton = document.getElementById(
    "mona-validate-markdown"
  );
  validateMarkdownButton.addEventListener("click", validateMarkdown);

  chrome.tabs.query(
    {
      active: true,
      lastFocusedWindow: true,
    },
    function (tabs) {
      const instructions = document.createElement("p");
      instructions.classList.add("instructions");

      if (tabs[0].url.includes("https://github.com")) {
        // instructs the user on how to validate their markdown
        instructions.innerText =
          "Welcome to GitHub! Click validate markdown to get feedback on your Github markdown.";
        replaceMainContent(instructions);
        enableButton(validateMarkdownButton);
      } else {
        // instructs the user to navigate to github to use the validator
        instructions.innerText = "Navigate to GitHub.com to get started";
        replaceMainContent(instructions);
        disableButton(validateMarkdownButton);
      }
    }
  );
};

initializePanel();
