// Import @11ty plugins
const rssPlugin = require('@11ty/eleventy-plugin-rss');

// Import filters
const bodyClassFilter = require('./src/filters/body-class-filter.js');
const formattedDateFilter = require('./src/filters/formatted-date-filter.js');
const htmlDateFilter = require('./src/filters/html-date-filter.js');
const yearFilter = require('./src/filters/year-filter.js');

// Import transforms
const parseTransform = require('./src/transforms/parse-transform.js');

// Import site information
const site = require('./src/_data/site.json');

module.exports = function(config) {

  // Plugins
  config.addPlugin(rssPlugin);

  // Filters
  config.addFilter('bodyClassFilter', bodyClassFilter);
  config.addFilter('formattedDateFilter', formattedDateFilter);
  config.addFilter('htmlDateFilter', htmlDateFilter);
  config.addFilter('yearFilter', yearFilter);

  // Transforms
  config.addTransform('parse', parseTransform);

  // Passthrough copy
  config.addPassthroughCopy({ "src/_includes/assets/css": "css" });
  config.addPassthroughCopy({"src/_includes/assets/fonts": "fonts"});
  config.addPassthroughCopy({"src/_includes/assets/images": "images"});
  config.addPassthroughCopy('src/js');

  // Limit homepage posts by the max posts per page.
  config.addCollection('homepagePosts', collection => {
    return [...collection.getFilteredByGlob('./src/posts/*.md')]
      .reverse()
      .slice(0, site.maxPostsPerPage);
  });

  return {
    dir: {
      input: "src",
      output: "dist",
      layouts: "_includes/layouts"
    }
  }
};
