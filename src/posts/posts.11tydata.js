import { DateTime } from 'luxon';

export const eleventyComputed = {
  year: function (data) {
    return DateTime.fromJSDate(data.date || data.page.date)
      .plus({ hours: 6 })
      .toFormat('yyyy');
  },
};
