import {
  LEVEL_1_HEADING_REGEX,
  LINK_REGEX,
  HELPER_LINKS,
  disableButton,
  enableButton,
  invalidLinks,
  createErrorListItem,
  createFeedbackGroup,
} from "./utils";

const replaceMainContent = (element) => {
  document.getElementById("main").innerHTML = "";
  return document.getElementById("main").append(element);
};

/**
 * Given the content of a textArea
 * return a list of accessibility errors found
 *
 * WORKING RULES:
 * - checks for a heading
 * - ensures that there is no h1
 * - ensures that links are descriptive
 *
 *
 * TODO:
 * - validate image alt text
 * - Report bugs individually. For example we report the "Non Descriptive Links" error once ... even if multiple links are not descriptive
 *   but it would be nice to report each link individually to provide more descriptive feedback.
 */
const provideFeedback = (textContent, type, id) => {
  const list = document.createElement("ul");
  list.ariaLabel = `Errors found in textArea with id: ${id}`;

  const hasHeading = textContent && textContent.includes("#");

  if (!hasHeading) {
    list.append(
      createErrorListItem(
        "Missing Heading",
        `Looks like you haven\'t added any headings to your ${type} body. <a href="${HELPER_LINKS.headings}">Learn how to use Markdown Headings</a>`
      )
    );
  }

  const usesLevel1Heading = textContent.match(LEVEL_1_HEADING_REGEX);
  if (usesLevel1Heading) {
    list.append(
      createErrorListItem(
        "Uses Level 1 Heading",
        `Looks like you\'re using a level 1 heading. That\'s already been set on this page. Try using a level two heading or <a href="${HELPER_LINKS.headings}">Learn how to use Markdown Headings</a>`
      )
    );
  }

  const links = textContent.match(LINK_REGEX) || [];

  if (invalidLinks(links).length) {
    list.append(
      createErrorListItem(
        "Non Descriptive Links",
        `Looks like your link text could be more descriptive. Avoid using words such as 'click here' or 'learn more' -- link text should provide context of where it will take a user. For more information <a href="${HELPER_LINKS.linkText}">Learn how to write descriptive links</a>`
      )
    );
  }

  // TODO
  const usesBadAltText = false;
  if (usesBadAltText) {
    // return {};
  }
  return list;
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

      list.ariaLabel = "edited textAreas";

      port.postMessage({ request: "getTextAreas" });

      port.onMessage.addListener((msg) => {
        msg.results.forEach((textArea) => {
          const { textAreaOutput, type, id } = textArea;
          const feedback = provideFeedback(textAreaOutput, type);

          if (feedback) {
            listItem = createFeedbackGroup(id, () => focus(id));
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
