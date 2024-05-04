// Import @11ty plugins
const rssPlugin = require('@11ty/eleventy-plugin-rss');
const markdownIt = require('markdown-it');
const markdownItEleventyImg = require("markdown-it-eleventy-img");
const path = require('path');

const { DateTime } = require("luxon");

// Import site information
const site = require('./src/_data/site.json');

// PostCSS goodness!
const postcss = require('postcss');
const cssnano = require('cssnano');
const postcssCustomMedia = require('postcss-custom-media');
const postcssImport = require('postcss-import');
const pxtorem = require('postcss-pxtorem');

// Import transforms
const parseTransform = require('./src/transforms/parse-transform.js');

module.exports = function (config) {

  config.setLibrary('md', markdownIt ({
    html: true,
    breaks: true,
    linkify: true
  })
  .use(markdownItEleventyImg, {
    imgOptions: {
      formats: ["webp"],
      widths: [1024, 500, 300],
      urlPath: "/images/",
      outputDir: "./src/images/",
      filenameFormat: function (id, src, width, format, options) {
        const { name } = path.parse(src);
        return `${name}-${width}.${format}`;
      }
    },
    globalAttributes: {
      sizes: "100vw"
    },

    renderImage(image, attributes) {
      const [ Image, options ] = image;
      const [ src, attrs ] = attributes;

      Image(src, options);

      const metadata = Image.statsSync(src, options);
      const imageMarkup = Image.generateHTML(metadata, attrs);

      return `<figure>${imageMarkup}${attrs.title ? `<figcaption>${attrs.title}</figcaption>` : ""}</figure>`;
    }
  }));

  config.addTemplateFormats('css');

  config.addExtension('css', {
    outputFileExtension: 'css',
    compile: async (content, path) => {
      if (path !== './src/styles/styles.css') {
        return;
      }

      return async () => {
        let output = await postcss([
          pxtorem({
            propList: ['*'],
          }),
          postcssImport,
          postcssCustomMedia,
          cssnano,
        ]).process(content, {
          from: path,
        });

        return output.css;
      }
    }
  });

  // Plugins
  config.addPlugin(rssPlugin);

  // Filters
  config.addFilter('htmlDateFilter', (value) => {
    const dateObject = new Date(value);
    return dateObject.toISOString();
  });

  config.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).plus({ hours: 8 }).toLocaleString(DateTime.DATE_FULL);
  });

    config.addFilter("archiveDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).plus({ hours: 8 }).toFormat('LL.\dd');
  });

  config.addFilter('truncatePost', (value) => {
    const truncate = (str, max = 40) => {
      const array = str.trim().split(' ');
      const ellipsis = array.length > max ? '...' : '';

      return array.slice(0, max).join(' ') + ellipsis;
    };

    const newValue = value.replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, "");
    return truncate(newValue);
  });

  // Transforms
  config.addTransform('parse', parseTransform);

  // Shortcodes
  config.addShortcode("year", () => `${new Date().getFullYear()}`);

  // Passthrough copy
  config.addPassthroughCopy({ 'src/images': 'images' });
  config.addPassthroughCopy({ 'src/fonts': 'fonts'});
  config.addPassthroughCopy('src/robots.txt');

  config.addCollection('feed', (collection) => {
    return [...collection.getFilteredByGlob('./src/posts/*.md')].reverse();
  });

  return {
    dir: {
      input: 'src',
      output: 'dist',
      includes: '_includes',
      layouts: '_layouts',
    },
  };
};
