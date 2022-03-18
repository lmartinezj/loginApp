
var compiler = require('./compiler');
 
// add comment
exports.java = function (clientSecret, bindIdAccessToken) {
    compiler.java('java/Main.java', clientSecret, bindIdAccessToken);
}
