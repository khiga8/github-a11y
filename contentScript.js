
 function appendAccessibilityInfo() {
  document.querySelectorAll('.markdown-body').forEach(function(commentBody) {
    // Adds alt image overlay. This is hidden from accesibility tree.
    commentBody.querySelectorAll('img').forEach(function(image) {
      const altText = image.getAttribute('alt');
      if (!altText) {
          image.classList.add('github-a11y-img-missing-alt')
      } else {
          const closestParagraph = image.closest('p');
          if (!closestParagraph) return; // TODO: handle when image is nested in elements like a table cell.
  
          closestParagraph.classList.add('github-a11y-img-container');
  
          const subtitle = document.createElement('span');
          subtitle.setAttribute('aria-hidden', 'true');
          subtitle.textContent = altText;
          subtitle.classList.add('github-a11y-img-caption');
          
          image.insertAdjacentElement('afterend', subtitle);
      }
    });
  
    // Appends heading level to headings. This is hidden from accesibility tree.
    commentBody.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(function(heading) {
      heading.classList.add('github-a11y-heading');
      const headingPrefix = document.createElement('span');
  
      headingPrefix.setAttribute('aria-hidden', 'true');
      headingPrefix.classList.add('github-a11y-heading-prefix');
      headingPrefix.textContent = ` ${heading.tagName.toLowerCase()}`;
  
      heading.append(headingPrefix);
    });
  });
 }

 chrome.runtime.onMessage.addListener(async (message) => {
  document.querySelectorAll(".github-a11y-img-caption").forEach(el => el.remove());
  document.querySelectorAll(".github-a11y-heading-prefix").forEach(el => el.remove());
  appendAccessibilityInfo();
});

appendAccessibilityInfo();
