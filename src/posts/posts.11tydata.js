import { DateTime } from 'luxon';

export const eleventyComputed = {
  yearString: ({page}) => DateTime.fromJSDate(page.date, {zone: 'utc'}).toFormat('yyyy'),
  dateString: ({page}) => DateTime.fromJSDate(page.date, {zone: 'utc'}),
  postDateString: ({page}) => DateTime.fromJSDate(page.date, {zone: 'utc'}).toLocaleString(DateTime.DATE_FULL),
  archiveDateString: ({page}) => DateTime.fromJSDate(page.date, {zone: 'utc'}).toFormat('LL.\dd')
};
