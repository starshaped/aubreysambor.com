// Import @11ty plugins
const rssPlugin = require('@11ty/eleventy-plugin-rss');

// Import transforms
const parseTransform = require('./src/transforms/parse-transform.js');

// Import utils
const addFonts = require('./src/utils/add-fonts.js');

const slugify = require("slugify");
const { DateTime } = require("luxon");

// Import site information
const site = require('./src/_data/site.json');

module.exports = function (config) {

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
    return DateTime.fromJSDate(dateObj).plus({ hours: 6 }).toLocaleString(DateTime.DATE_MED);
  });

  // Transforms
  config.addTransform('parse', parseTransform);

  // Utils
  addFonts();

  // Shortcodes
  config.addShortcode("year", () => `${new Date().getFullYear()}`);

  // Passthrough copy
  config.addPassthroughCopy({ 'src/_includes/assets/css': 'css' });
  config.addPassthroughCopy({ 'src/_includes/assets/fonts': 'fonts' });
  config.addPassthroughCopy({ 'src/_includes/assets/images': 'images' });
  config.addPassthroughCopy('src/js');

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
