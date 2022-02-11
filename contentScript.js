document.querySelectorAll('.markdown-body').forEach(function(commentBody) {
  commentBody.querySelectorAll('img').forEach(function(image) {
    const altText = image.getAttribute('alt');
    if (!altText) {
        image.style = 'border: 10px solid red;'
    } else {
        const closestParagraph = image.closest('p');
        if (!closestParagraph) return; // TODO: handle when image is nested in elements like a table cell.

        closestParagraph.style = "position: relative; padding: 0; margin: 0;";

        const subtitle = document.createElement('span');
        subtitle.setAttribute('aria-hidden', 'true');
        subtitle.textContent = altText;
        subtitle.style = 'display: block; background-color: #121212; padding: 0.5em; color: white; position: absolute; bottom: 0.5em; left: 0; font-weight: 700; z-index: 2; width: 100%; font-size: 1.0rem; opacity: 0.6;';
        
        image.insertAdjacentElement('afterend', subtitle);
    }
  });

  commentBody.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(function(heading) {
    const headingLevel = heading.tagName;
    const headingPrefix = document.createElement('span');

    headingPrefix.setAttribute('aria-hidden', 'true');
    headingPrefix.textContent = `${headingLevel} `;
    headingPrefix.style = "color: purple; font-weight: 700;";

    heading.insertBefore(headingPrefix, heading.firstChild);
  });
});
  
