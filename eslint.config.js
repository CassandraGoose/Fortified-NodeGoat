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
    // Vendored third-party libraries (jquery, bootstrap, chart/raphael/morris, html5shiv, ...) are
    // shipped in-tree under app/assets/vendor and are not our source — don't lint them.
    {
        ignores: ["app/assets/vendor/**"],
    },
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
        files: ["test/e2e/**/*.js", "test/security/**/*.js"],
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.mocha, // describe, it, before, after, beforeEach, afterEach, context, ...
                ...globals.chai, // expect, assert (Cypress exposes chai)
                cy: "readonly",
                Cypress: "readonly",
                expect: "readonly", // Cypress exposes Chai v4's assert/expect
                assert: "readonly",
            },
        },
    },
    pluginSecurity.configs.recommended,
    {
        files: ["**/*.js"],
        ...stylisticConfig,
    },
];
