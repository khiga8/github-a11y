# github-a11y

This is a Google Chrome extension that runs a simple JavaScript snippet on github.com domain and aims to encourage accessibility mindfulness while navigating GitHub. Users interact with GitHub predominantly through the markdown editor. The markdown editor allows users to set headings and share images, both of which require care to ensure accessibility.

## Prerequisite

This assumes you are using a Google Chrome browser.

## Setup

1. Download this repo as a `ZIP` file.
2. Navigate to `chrome://extensions/`.
3. Select `Load unpacked`.
4. Choose this unzipped repo folder.
5. Navigate to github.com.

## Features

This extension will only run on GitHub domain and does the folowing on all markdown bodies on GitHub:

- Creates a text overlay over all images with the alt text. This includes Pull Requests, Issues, Repo READMEs, and Discussions. If an image is missing an alt text, it will appear with a red border. Images are frequently shared within GitHub. This image overlay aims to bring awareness about alt text particularly for sighted users who may not rely on alt text.

<img width="851" alt="Example screenshots of images that have been posted on a GitHub issue. The extension has added a white text containing alt text against dark image overlay." src="https://user-images.githubusercontent.com/16447748/153546975-920b181b-e7c6-42ae-98bd-bf31ddf81604.png">

- Appends the heading level that is used after the heading text within markdown bodies. Heading levels are useful for conveying semantics for screen reader, and other assistive technology users. This similarly aims to bring mindfulness particularly for sighted users who may pay less attention to heading level semantics.

<img width="916" alt="Example screenshots of purple heading levels appended in at end of heading text line inside a GitHub markdown" src="https://user-images.githubusercontent.com/16447748/153683612-1b7d5975-ed45-4985-892d-6fd64545d18d.png">


**Note**: This is currently not customizable and the styling I've set may not be suitable for all users. Feel free to customize this however you like when you download these files. You can do this by modifying `styles.css` to your preferred styling. Then press `Update` on `chrome://extensions/` so changes are reflected in extension.

## Resources

### Image alt text

- [WebAIM: Alternative Text](https://webaim.org/techniques/alttext/)

### Heading levels

- [WAI: Headings](https://www.w3.org/WAI/tutorials/page-structure/headings/)
- [Medium: Headings for Visually Inclined](https://medium.com/@inkblotty/headings-for-the-visually-inclined-c537e87865f)

## Bug?

If you encounter a bug, please file a ticket. Contributions welcome.
