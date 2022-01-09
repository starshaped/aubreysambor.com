const jsdom = require('jsdom');
const slugify = require('slugify');

const { JSDOM } = jsdom;

module.exports = function (value, outputPath) {
  if (outputPath.endsWith('.html')) {
    const DOM = new JSDOM(value, {
      resources: 'usable',
    });

    const document = DOM.window.document;
    const articleImages = [...document.querySelectorAll('main article img')];
    const articleHeadings = [
      ...document.querySelectorAll('main article h2, main article h3'),
    ];

    // Image manipulations
    if (articleImages.length) {
      articleImages.forEach((image) => {
        image.setAttribute('loading', 'lazy');

        // If an image has a title it means that the user added a caption
        // so replace the image with a figure containing that image and a caption
        if (image.hasAttribute('title')) {
          const figure = document.createElement('figure');
          const figCaption = document.createElement('figcaption');

          figCaption.innerHTML = image.getAttribute('title');

          image.removeAttribute('title');

          figure.appendChild(image.cloneNode(true));
          figure.appendChild(figCaption);

          image.replaceWith(figure);
        }
      });
    }

    // Heading manipulations
    if (articleHeadings.length) {
      // Loop each heading and add a little anchor and an ID to each one
      articleHeadings.forEach((heading) => {
        if (!heading.classList.contains('post-listing__title')) {
          const headingSlug = slugify(heading.textContent.toLowerCase(), {
            remove: /[*+~.()'"!:@]/g,
          });
          const anchor = document.createElement('a');

          anchor.setAttribute('href', `#heading-${headingSlug}`);
          anchor.classList.add('heading-permalink');
          anchor.innerHTML = '#';

          heading.setAttribute('id', `heading-${headingSlug}`);
          heading.appendChild(anchor);
        }
      });
    }

    return '<!DOCTYPE html>\r\n' + document.documentElement.outerHTML;
  }
  return value;
};
