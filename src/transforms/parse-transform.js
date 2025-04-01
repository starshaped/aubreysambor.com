import slugify from 'slugify';
import { JSDOM } from 'jsdom';

export default function (value, outputPath) {
  if (outputPath.endsWith('.html')) {
    const DOM = new JSDOM(value, {
      resources: 'usable',
    });

    const document = DOM.window.document;
    const articleHeadings = [
      ...document.querySelectorAll('main article h2, main article h3'),
    ];

    // Heading manipulations
    if (articleHeadings.length) {
      // Loop each heading and add a little anchor and an ID to each one
      articleHeadings.forEach((heading) => {
        if (!heading.classList.contains('archives-list__title')) {
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
