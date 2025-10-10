// Import @11ty plugins
import { VentoPlugin } from 'eleventy-plugin-vento';
import rssPlugin from '@11ty/eleventy-plugin-rss';
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import markdownIt from 'markdown-it';
import markdownItContainer from 'markdown-it-container';
import { eleventyImageTransformPlugin } from '@11ty/eleventy-img';

// PostCSS goodness!
import postcss from 'postcss';
import cssnano from 'cssnano';
import postcssCustomMedia from 'postcss-custom-media';
import postcssImport from 'postcss-import';

export default async function (eleventyConfig) {

  eleventyConfig.setLibrary('md', markdownIt ({
    html: true,
    breaks: true,
    linkify: false
  }));

  eleventyConfig.amendLibrary("md", (mdLib) => mdLib.use(markdownItContainer, 'container'));
  eleventyConfig.amendLibrary("md", (mdLib) => mdLib.use(markdownItContainer, 'container-inner'));

  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    // which file extensions to process
    extensions: 'html',
    // optional, output image formats
    formats: ['jpg', 'webp'],
    // optional, output image widths
    widths: [1024, 500, 300],
    // optional, attributes assigned on <img> override these values.
    defaultAttributes: {
      loading: 'lazy',
      sizes: '100vw',
      decoding: 'async',
    },
  });

  // Plugins
  eleventyConfig.addPlugin(rssPlugin);
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addWatchTarget('./src/assets/styles');
  eleventyConfig.addTemplateFormats('css');

  eleventyConfig.addExtension('css', {
    outputFileExtension: 'css',
    compile: async (content, path) => {
      if (path !== './src/assets/styles/styles.css') {
        return;
      }

      return async () => {
        let output = await postcss([
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

  // Filters
  eleventyConfig.addFilter("uriencode", function(value) {
    return encodeURIComponent(value);
  });

  eleventyConfig.addFilter("getNewestCollectionItemDate", rssPlugin.getNewestCollectionItemDate);
  eleventyConfig.addFilter("dateToRfc3339", rssPlugin.dateToRfc3339);

  eleventyConfig.addFilter("capitalize", (item) => {
    return item[0].toUpperCase() + item.slice(1);
  });

  /** Groups array of objects by a property value (note: array in, object out). */
  eleventyConfig.addFilter('groupBy', (array, prop) => {
    if (Array.isArray(array) === false) { throw new Error(`groupBy filter expects an array, was given ${typeof array}`); }
    if (!prop || typeof prop !== 'string') { throw new Error(`groupBy filter expects a property key (or dot-separated path), was given ${typeof prop}`); }
    
    const groups = {};

    for (let item of array) {
      let groupVal = getDeepProp(item, prop);

      if (groups.hasOwnProperty(groupVal) === false) {
        groups[groupVal] = [];
      }

      groups[groupVal].push(item);
    }

    return groups;
  });

  // Shortcodes
  eleventyConfig.addShortcode("currentYear", () => `${new Date().getFullYear()}`);

  // Passthrough copy
  eleventyConfig.addPassthroughCopy('src/assets/styles/styles.css');
  eleventyConfig.addPassthroughCopy('src/assets/fonts');
  eleventyConfig.addPassthroughCopy('src/assets/js/scripts.js');
  eleventyConfig.addPassthroughCopy('src/robots.txt');

  eleventyConfig.addCollection('list', (collection) => {
    return [...collection.getFilteredByGlob('./src/posts/*.md')];
  });

  eleventyConfig.addCollection('tagsList', (collection) => {
    const tagsList = new Set();
    collection.getAll().map( item => {
      if (item.data.tags) {
        item.data.tags.map( tagItem => tagsList.add(tagItem))
      }
    });
     return [...tagsList].sort((a, b) => a.localeCompare(b))
  });

  eleventyConfig.addPlugin(VentoPlugin, {
    autotrim: true,
  });
};

export const config = {
  htmlTemplateEngine: "vto",
  markdownTemplateEngine: "vto",
  dir: {
    input: 'src',
    output: 'dist',
    includes: 'components',
    layouts: 'layouts',
  },
};

function getDeepProp(obj, prop = null) {
	// If there is no property, return the value as-is
	if (!prop) { return obj; }

	// Create a list of properties to pluck one by one
	const propChain = prop.split('.');
	let groupVal = obj; // Start with the original value
	const chain = propChain.slice();
	while (chain.length > 0 && groupVal !== null) {
		const subProp = chain.shift().trim();
		groupVal = groupVal[subProp] ?? null;
	}
	return groupVal;
}
