module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module"
    },
    extends: [
        "plugin:@typescript-eslint/recommended"
    ],
    rules: {
        "comma-dangle": ["error"],
        "max-len": ["error", { comments: 80 }],
        quotes: ["error"]
    }
};
