module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
        'vue/setup-compiler-macros': true,
    },
    extends: [
        //'eslint:recommended',
        'plugin:vue/essential',
        'plugin:vue/vue3-recommended',
        'prettier',
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: "@typescript-eslint/parser",
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['vue']
}
