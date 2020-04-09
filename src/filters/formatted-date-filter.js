const moment = require('moment');

module.exports = function dateFilter(value) {
  const dateObject = moment(value).add(6, 'hour').format('MMMM Do, YYYY');
  return dateObject;
};
