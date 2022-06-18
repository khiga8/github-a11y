const HELPER_LINKS = {
    headings: 'https://www.markdownguide.org/basic-syntax/#headings',
};

function updateMain(content) {
    document.getElementById('main').innerHTML = content;
}

function detectIfEditor(element) {
    return element.getAttribute('class').includes('CodeMirror') || element.tagName === 'TEXTAREA';
}

function getType(element) {
    if (element.tagName === 'TEXTAREA' && element.getAttribute('name').includes('comment')) {
        return 'comment';
    }

    if (element.tagName === 'TEXTAREA' && element.getAttribute('name').includes('issue')) {
        return 'issue';
    }
}

const LEVEL_1_HEADING_REGEX = /\#\s/g;
function provideFeedback(element) {
    const textContent = element.innerText;
    const type = getType(element);
    
    const hasHeading = textContent.contains('#');
    if (!hasHeading) {
        return {
            title: 'Missing Headings',
            message: `Looks like you haven\'t added any headings to your ${type} body. <a href="${HELPER_LINKS.headings}">Learn how to use Markdown Headings</a>`
        }
    }

    const usesLevel1Heading = LEVEL_1_HEADING_REGEX.test(textContent);
    if (usesLevel1Heading) {
        return {
            title: 'Uses Level 1 Heading',
            message: `Looks like you\'re using a level 1 heading. That\'s already been set on this page. Try using a level two heading or <a href="${HELPER_LINKS.headings}">Learn how to use Markdown Headings</a>`
        }
    }

    const usesNonDescriptiveLinks = false;
    if (usesNonDescriptiveLinks) {
        return {}
    }

    const usesBadAltText = false;
    if (usesBadAltText) {
        return {}
    }
}

function detectGitHubWindow() {
    if (window.location.includes('https://github.com')) {
        updateMain('Welcome to GitHub! Find a Markdown Editor to get feedback on.');
    }

    if (detectIfEditor(document.activeElement)) {
        const feedback = provideFeedback(document.activeElement);
        if (feedback) {
            updateMain(`<h2>${feedback.title}:</h2><p>${feedback.message}</p>`)
        }
    }
}

updateMain('Navigate to GitHub.com to get started');