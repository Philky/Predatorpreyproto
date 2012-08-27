var prototype = require('../lib/prototype');

exports.testInit = function(test) {
  var result = prototype.init();
  test.equal(result, undefined, "result of init should be undefined");
  test.done();
};