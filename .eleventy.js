// Import @11ty plugins
const rssPlugin = require('@11ty/eleventy-plugin-rss');

// Import filters
const formattedDateFilter = require('./src/filters/formatted-date-filter.js');
const htmlDateFilter = require('./src/filters/html-date-filter.js');

// Import transforms
const parseTransform = require('./src/transforms/parse-transform.js');

// Import site information
const site = require('./src/_data/site.json');

const slugify = require("slugify");

module.exports = function (config) {
  // Plugins
  config.addPlugin(rssPlugin);

  // Filters
  config.addFilter('formattedDateFilter', formattedDateFilter);
  config.addFilter('htmlDateFilter', htmlDateFilter);

  config.addFilter("slug", (str) => {
    return slugify(str, {
      lower: true,
      strict: true,
      remove: /["]/g,
    });
  });

  // Transforms
  config.addTransform('parse', parseTransform);

  // Passthrough copy
  config.addPassthroughCopy({ 'src/_includes/assets/css': 'css' });
  config.addPassthroughCopy({ 'src/_includes/assets/fonts': 'fonts' });
  config.addPassthroughCopy({ 'src/_includes/assets/images': 'images' });
  config.addPassthroughCopy('src/js');

  // Limit homepage posts by the max posts per page.
  config.addCollection('homepagePosts', (collection) => {
    return [...collection.getFilteredByGlob('./src/posts/*.md')]
      .reverse()
      .slice(0, site.maxPostsPerPage);
  });

  config.addCollection('archives', (collection) => {
    return collection.getAll();
  });

  return {
    dir: {
      input: 'src',
      output: 'dist',
      layouts: '_includes/layouts',
    },
  };
};
