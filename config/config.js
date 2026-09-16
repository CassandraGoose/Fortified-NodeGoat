const path = require("path");
const util = require("util");
require("dotenv").config();
const finalEnv = process.env.NODE_ENV || "development";

const allConf = require(path.resolve(__dirname + "/../config/env/all.js"));
// finalEnv var is not manipulatable for an attack.
// eslint-disable-next-line security/detect-non-literal-require
const envConf = require(path.resolve(__dirname + "/../config/env/" + finalEnv.toLowerCase() + ".js")) || {};

const config = { ...allConf, ...envConf };

console.log(`Current Config:`);
console.log(util.inspect(config, false, null));

module.exports = config;
