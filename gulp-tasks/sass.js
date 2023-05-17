const { dest, src } = require('gulp');
const cleanCSS = require('gulp-clean-css');
const postcss = require('gulp-postcss');
const postcssCustomMedia = require('postcss-custom-media');
const pxtorem = require('postcss-pxtorem');
const sassProcessor = require('gulp-sass')(require('sass'));

// Flags whether we compress the output etc
const isProduction = process.env.NODE_ENV === 'production';

const plugins = [
  pxtorem({
    propList: ['*'],
  }),
  postcssCustomMedia(),
];

// The main Sass method grabs all root Sass files,
// processes them, then sends them to the output calculator
const sass = () => {
  return src('./src/_includes/assets/sass/*.scss')
    .pipe(sassProcessor().on('error', sassProcessor.logError))
    .pipe(postcss(plugins))
    .pipe(
      cleanCSS(
        isProduction
          ? {
              level: 2,
            }
          : {}
      )
    )
    .pipe(dest('./src/_includes/assets/css', { sourceMaps: !isProduction }));
};

module.exports = sass;
