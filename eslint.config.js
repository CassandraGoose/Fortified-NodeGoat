const js = require("@eslint/js");
const globals = require("globals");
const pluginSecurity = require("eslint-plugin-security");

module.exports = [
    js.configs.recommended,
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: 2018,
            sourceType: "commonjs",
            globals: {
                ...globals.node
            }
        }
    },
    {
        files: ["test/e2e/**/*.js"],
        languageOptions: {
            globals: {
                ...globals.node,
                cy: "readonly",
                Cypress: "readonly"
            }
        }
    },
    pluginSecurity.configs.recommended
];