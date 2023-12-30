const { DateTime } = require('luxon');

module.exports = {
  eleventyComputed: {
    year: function (data) {
      return DateTime.fromJSDate(data.date || data.page.date)
        .plus({ hours: 6 })
        .toFormat('yyyy');
      // return new Date(data.date || data.page.date).getFullYear();
    },
  },
};
