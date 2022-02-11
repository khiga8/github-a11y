# github-a11y

This is a very simple Google Chrome extension that always runs on github.com, and aims to encourage accessibility mindfulness while navigating GitHub. Users interact with GitHub predominantly through the markdown editor. The markdown editor allows users to set headings and share images, both of which require care to ensure accessibility.

## Prerequisite

This assumes you are using a Google Chrome browser.

## Setup

1. Download this repo as a `ZIP` file.
2. Navigate to `chrome://extensions/`.
3. Select `Load unpacked`.
4. Choose this unzipped repo folder.
5. Navigate to github.com

## Features

This extension will only run on GitHub domain and does the folowing on all markdown bodies on GitHub:

- Creates a text overlay over all images with the alt text. This includes Pull Requests, Issues, Repo READMEs, and Discussions. If an image is missing an alt text, it will appear with a red border. Images are frequently shared within GitHub and this aims to bring mindfulness. This image overlay aims to bring awareness particularly for sighted users who may not rely on alt text.

<img width="851" alt="Example screenshots of images that have been posted on a GitHub issues, with a white text against dark overlay." src="https://user-images.githubusercontent.com/16447748/153546975-920b181b-e7c6-42ae-98bd-bf31ddf81604.png">

- Appends the heading level that is used in front of the headings within markdown bodies. Heading levels are useful for conveying semantics for screen reader, and other assistive technology users. This similarly aims to bring mindfulness.

<img width="683" alt="Example screenshots of purple heading levels that have been appended in front of headings inside a GitHub markdown" src="https://user-images.githubusercontent.com/16447748/153546987-abd8d537-a980-437b-bfc5-243291f1cecc.png">



**Note**: This is currently not customizable and the styling I've set may not be suitable for all users. Feel free to customize this when you download these files.
