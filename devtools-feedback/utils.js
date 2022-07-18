export const LEVEL_1_HEADING_REGEX = /(\n|\s|^)\#\s/g;
export const LINK_REGEX = /<a(.*?)>(.*?)<\/a>/g;
export const INNER_LINK_REGEX = /(?<=>).+?(?=<\/a)/g;

// TODO: internationalization
const NON_DESCRIPTIVE_LINK_TEXT = [
  "click here",
  "click this",
  "go",
  "here",
  "this",
  "start",
  "right here",
  "more",
  "learn more",
];

export const HELPER_LINKS = {
  headings: "https://www.markdownguide.org/basic-syntax/#headings",
  linkText: "https://webaim.org/techniques/hypertext/link_text",
};

export const disableButton = (button) => {
  button.ariaDisabled = true;
  button.disabled = true;
};

export const enableButton = (button) => {
  button.ariaDisabled = false;
  button.disabled = false;
};

/** Given a list of links check if the link text is descriptive enough */
export const invalidLinks = (links) => {
  return links.filter((link) => {
    const description = link.match(INNER_LINK_REGEX) || [];
    return NON_DESCRIPTIVE_LINK_TEXT.includes(description[0].toLowerCase());
  });
};

/** Create an error message <li> */
export const createErrorListItem = (title, message) => {
  const listItem = document.createElement("li");
  const heading = document.createElement("h3");
  const paragraph = document.createElement("p");

  heading.innerHTML = title;
  paragraph.innerHTML = message;

  listItem.append(heading);
  listItem.append(paragraph);

  return listItem;
};

/** Create a <li> for each textArea */
export const createFeedbackGroup = (id, highlightEvent) => {
  const listItem = document.createElement("li");
  const heading = document.createElement("h2");
  const divider = document.createElement("hr");
  const highlightButton = document.createElement("button");

  listItem.classList.add("feedbackGroup");
  divider.classList.add("divider");
  heading.innerText = `Markdown textArea with id: "${id}"`;
  highlightButton.innerText = "Find TextArea";
  highlightButton.addEventListener("click", highlightEvent);

  listItem.append(heading);
  listItem.append(divider);
  listItem.append(highlightButton);

  return listItem;
};
