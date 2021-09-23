"use strict";
exports.__esModule = true;
exports.choose = exports.wait = void 0;
var util_1 = require("util");
exports.wait = util_1.promisify(setTimeout);
var choose = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};
exports.choose = choose;
