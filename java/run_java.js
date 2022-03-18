
var compiler = require('./compiler');
 
// add comment
exports.java = function (clientSecret, bindIdAccessToken) {
    compiler.java('FeedbackAuthValue.java', clientSecret, bindIdAccessToken);
}
