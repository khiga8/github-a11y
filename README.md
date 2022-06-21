# github-a11y

This is a browser extension that runs a simple JavaScript snippet on github.com domain and aims to encourage accessibility mindfulness while navigating GitHub. Users interact with GitHub predominantly through the markdown editor. The markdown editor allows users to set headings and share images, both of which require care to ensure accessibility.

## Setup

### Chrome

1. Download this repo as a `ZIP` file. You can also simply clone this repo.
2. Navigate to `chrome://extensions/`.
3. Flip on "Developer Mode" in the upper right-hand corner.
4. Select "Load unpacked".
5. Choose this unzipped repo folder.
6. Navigate to github.com.
7. **Optional but recommended**: Set custom styles to your preference. Learn more in the [Customization note](#customization-note).

### Firefox

1. Clone or download this repo. Make sure to extract any compressed files to the directory structure of this project.
2. Navigate to `about:debugging#/runtime/this-firefox`.
3. Select `Load Temporary Add-on...`.
4. Choose a file in the repository directory.
5. Navigate to github.com.
6. **Optional but recommended**: Set custom styles to your preference. Learn more in the [Customization note](#customization-note).

## Features

This extension will only run on GitHub domain and does the following on all markdown bodies on GitHub:

- Creates a text overlay over all images with the alt text. This includes Pull Requests, Issues, Repo READMEs, and Discussions. 
    - If an image is missing an alt text, it will appear with a red border. 
    - **If an image has an empty string alt like `""`, it will also appear with a red border**. Typically, an empty string alt indicates that an image is decorative and should be hidden. However, on GitHub, all markdown images are rendered within a link element. Therefore, we recommend that all images in GitHub markdown have an alt text provided or the link will be announced without a bane,

<img width="600" alt="Example screenshots of two images that have been posted on a GitHub issue, each appearing with alt text overlay. The first has unhelpful alt text based on the filename, `Screen Shot 2022-02-10` while the second image has a more intentional alt text, `Screenshot of example select menu...`." src="https://user-images.githubusercontent.com/16447748/154407948-1d02f35f-52ce-49ed-b098-e3528018230b.png">

- Appends the heading level that is used after the heading text within markdown bodies. Heading levels are useful for conveying semantics for screenreader, and other assistive technology users. This similarly aims to bring mindfulness particularly for sighted users who may pay less attention to heading level semantics.

<img width="600" alt="Example screenshots of heading levels appended at end of heading text line inside a GitHub markdown, each represented by a different color" src="https://user-images.githubusercontent.com/16447748/154763325-57ad4785-691c-4760-b0ca-b2e3cabacd1f.png">


### Customization note

The styling I've set may not be suitable for all users. Feel free to customize these however you like when you download these files. 

You can do this by modifying `styles.css`. There are CSS variables at the top which you may set to your preference. For example, you may choose to set a different color for each heading level or remove the border. If you'd prefer the headings to be positioned at the front, follow the notes in `contentScript.js`. Once changes are made, `Update` on `chrome://extensions/` so changes are reflected in the extension.

## Resources

### Image alt text

- [WebAIM: Alternative Text](https://webaim.org/techniques/alttext/)

### Heading levels

- [WAI: Headings](https://www.w3.org/WAI/tutorials/page-structure/headings/)
- [Medium: Headings for Visually Inclined](https://medium.com/@inkblotty/headings-for-the-visually-inclined-c537e87865f)

## Bug?

If you encounter a bug, please file a ticket. Contributions welcome.
