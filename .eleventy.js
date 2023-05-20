// Import @11ty plugins
const rssPlugin = require('@11ty/eleventy-plugin-rss');

const postcss = require('postcss');
const cssnano = require('cssnano');
const postcssImport = require('postcss-import');
const postcssCustomMedia = require('postcss-custom-media');
const pxtorem = require('postcss-pxtorem');

// Import transforms
const parseTransform = require('./src/transforms/parse-transform.js');

// Import utils
const addFonts = require('./src/utils/add-fonts.js');

const slugify = require("slugify");
const { DateTime } = require("luxon");

// Import site information
const site = require('./src/_data/site.json');

module.exports = function (config) {

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

  config.addFilter("slug", (str) => {
    return slugify(str, {
      lower: true,
      strict: true,
      remove: /["]/g,
    });
  });

  config.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).plus({ hours: 6 }).toLocaleString(DateTime.DATE_FULL);
  });

  config.addFilter('truncatePost', (value) => {
    const truncate = (str, max = 40) => {
      const array = str.trim().split(' ');
      const ellipsis = array.length > max ? '...' : '';

      return array.slice(0, max).join(' ') + ellipsis;
    };

    const newValue = value.replace(/(<([^>]+)>)/gi, "");
    return truncate(newValue);
  });

  // Transforms
  config.addTransform('parse', parseTransform);

  // Utils
  addFonts();

  // Shortcodes
  config.addShortcode("year", () => `${new Date().getFullYear()}`);

  // Passthrough copy
  config.addPassthroughCopy({ 'src/_includes/assets/styles': 'styles' });
  config.addPassthroughCopy({ 'src/_includes/assets/fonts': 'fonts' });
  config.addPassthroughCopy({ 'src/_includes/assets/images': 'images' });

  config.addCollection('feed', (collection) => {
    return [...collection.getFilteredByGlob('./src/posts/*.md')].reverse();
  });

  config.setUseGitIgnore(false);

  return {
    dir: {
      input: 'src',
      output: 'dist',
      layouts: '_includes/layouts',
    },
  };
};
