"use strict";
exports.__esModule = true;
exports.wait = void 0;
var util_1 = require("util");
exports.wait = util_1.promisify(setTimeout);
