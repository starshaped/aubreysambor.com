// Import @11ty plugins
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
    filenameFormat: function (id, src, width, format, options) {
      return `${id}-${width}.${format}`;
    },
  });

  // Plugins
  eleventyConfig.addPlugin(rssPlugin);
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addWatchTarget('./src/styles');
  eleventyConfig.addTemplateFormats('css');

  eleventyConfig.addExtension('css', {
    outputFileExtension: 'css',
    compile: async (content, path) => {
      if (path !== './src/styles/styles.css') {
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
  eleventyConfig.addFilter('truncatePost', (value) => {
    const truncate = (str, max = 40) => {
      const array = str.trim().split(' ');
      const ellipsis = array.length > max ? '...' : '';

      return array.slice(0, max).join(' ') + ellipsis;
    };

    const newValue = value.replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, "");
      return truncate(newValue);
  });

  eleventyConfig.addFilter("uriencode", function(value) {
    return encodeURIComponent(value);
  });

  // Shortcodes
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // Passthrough copy
  // eleventyConfig.addPassthroughCopy('src/images');
  eleventyConfig.addPassthroughCopy('src/fonts');
  eleventyConfig.addPassthroughCopy('src/js/scripts.js');
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
};

export const config = {
  dir: {
    input: 'src',
    output: 'dist',
    includes: '_includes',
    layouts: '_layouts',
  },
};
