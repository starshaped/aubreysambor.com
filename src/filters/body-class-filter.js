module.exports = function bodyClassFilter(value) {
  const bodyClass = value.split(" ").join("-").toLowerCase();
  return bodyClass;
};
