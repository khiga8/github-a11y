/* ATTENTION: Based on heading position preference, swap `addHeadingToBack` with `addHeadingToFront` in line 45. */

/* Places heading at end of line */
function addHeadingToBack(heading, headingPrefix) {
  headingPrefix.classList.add('github-a11y-heading-prefix', 'github-a11y-heading-prefix-after');
  headingPrefix.textContent = ` ${heading.tagName.toLowerCase()}`;
  heading.classList.add('github-a11y-heading', 'github-a11y-heading-after');
  heading.append(headingPrefix);
}

/* Places heading in front of line */
function addHeadingToFront(heading, headingPrefix) {
  headingPrefix.textContent = `${heading.tagName.toLowerCase()} `;
  headingPrefix.classList.add('github-a11y-heading-prefix');
  heading.insertBefore(headingPrefix, heading.firstChild);
}

function appendAccessibilityInfo() {
  document.querySelectorAll('.markdown-body').forEach(function(commentBody) {
    // Adds alt image overlay. This is hidden from accesibility tree.
    commentBody.querySelectorAll('img').forEach(function(image) {
      const altText = image.getAttribute('alt');
      if (!altText) {
          image.classList.add('github-a11y-img-missing-alt')
      } else {
          const closestParagraph = image.closest('p');
          if (!closestParagraph) return;
  
          closestParagraph.classList.add('github-a11y-img-container');
  
          const subtitle = document.createElement('span');
          subtitle.setAttribute('aria-hidden', 'true');
          subtitle.textContent = altText;
          subtitle.classList.add('github-a11y-img-caption');
          
          image.insertAdjacentElement('afterend', subtitle);
      }
    });
  
    // Appends heading level to headings. This is hidden from accesibility tree
    commentBody.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(function(heading) {
      const headingPrefix = document.createElement('span');
      headingPrefix.setAttribute('aria-hidden', 'true');

      addHeadingToBack(heading, headingPrefix); // Swappable with `addHeadingToFront`
    });
  });
 }

function cleanup() {
  document.querySelectorAll(".github-a11y-img-caption").forEach(el => el.remove());
  document.querySelectorAll(".github-a11y-heading-prefix").forEach(el => el.remove());
}

/* Listen for messages from the background script */
chrome.runtime.onMessage.addListener(async () => {
  cleanup();
  appendAccessibilityInfo();
});

appendAccessibilityInfo();
