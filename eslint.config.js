const js = require("@eslint/js");
const globals = require("globals");
const pluginSecurity = require("eslint-plugin-security");
const stylistic = require("@stylistic/eslint-plugin");

const stylisticConfig = stylistic.configs.customize({
    indent: 4,
    quotes: "double",
    semi: true,
    braceStyle: "1tbs",
});

module.exports = [
    js.configs.recommended,
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: 2018,
            sourceType: "commonjs",
            globals: {
                ...globals.node,
            },
        },
    },
    {
        files: ["test/e2e/**/*.js"],
        languageOptions: {
            globals: {
                ...globals.node,
                cy: "readonly",
                Cypress: "readonly",
            },
        },
    },
    pluginSecurity.configs.recommended,
    {
        files: ["**/*.js"],
        ...stylisticConfig,
    },
];
