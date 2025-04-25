// Import @11ty plugins
import rssPlugin from '@11ty/eleventy-plugin-rss';
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import markdownIt from 'markdown-it';

// PostCSS goodness!
import postcss from 'postcss';
import postcssCustomMedia from 'postcss-custom-media';
import postcssImport from 'postcss-import';

import markdownItEleventyImg from "markdown-it-eleventy-img";
import { parse } from 'path';
import { DateTime } from "luxon";

// Import transforms
import parseTransform from './src/transforms/parse-transform.js';

export default function (config) {

  config.setLibrary('md', markdownIt ({
    html: true,
    breaks: true,
    linkify: true
  })
  .use(markdownItEleventyImg, {
    imgOptions: {
      formats: ["webp", "jpeg"],
      widths: [1024, 500, 300],
      urlPath: "/images/",
      outputDir: "./src/images/",
      filenameFormat: function (id, src, width, format, options) {
        const { name } = parse(src);
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

  // Plugins
  config.addPlugin(rssPlugin);
  config.addPlugin(syntaxHighlight);

  config.addWatchTarget('./src/styles');
  config.addTemplateFormats('css');

  config.addExtension('css', {
    outputFileExtension: 'css',
    compile: async (content, path) => {
      if (path !== './src/styles/styles.css') {
        return;
      }

      return async () => {
        let output = await postcss([
          postcssImport,
          postcssCustomMedia,
        ]).process(content, {
          from: path,
        });
        return output.css;
      }
    }
  });

  // Filters
  config.addFilter('htmlDateFilter', (dateObj) => {
    return DateTime.fromJSDate(dateObj).plus({ hours: 8 });
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
  config.addPassthroughCopy('src/js/scripts.js');
  config.addPassthroughCopy('src/robots.txt');

  config.addCollection('list', (collection) => {
    return [...collection.getFilteredByGlob('./src/posts/*.md')];
  });

  config.addCollection('tagsList', (collection) => {
    const tagsList = new Set();
    collection.getAll().map( item => {
      if (item.data.tags) {
        item.data.tags.map( tagItem => tagsList.add(tagItem))
      }
    });
     return [...tagsList].sort((a, b) => a.localeCompare(b))
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
