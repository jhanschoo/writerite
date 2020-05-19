module.exports = {
    "root": true,
    "parser": "@typescript-eslint/parser",
    "plugins": [
        "jsdoc",
        "@typescript-eslint",
    ],
    "extends": [
        "eslint:recommended",
        //"plugin:jsdoc/recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
    ],
    "parserOptions": {
        "tsconfigRootDir": __dirname,
        "project": "tsconfig.dev.json",
    },
    "ignorePatterns": [
        "generated/"
    ],
    "settings": {
        "jsdoc": {
            "mode": "typescript",
        },
    },
    /*
    "env": {
        "es6": true
    },
    */
    "rules": {
        "@typescript-eslint/array-type": "warn",
        "@typescript-eslint/ban-ts-comment": "warn",
        "@typescript-eslint/class-literal-property-style": "warn",
        "@typescript-eslint/explicit-module-boundary-types": "warn",
        "@typescript-eslint/indent": ["warn", 2],
        "@typescript-eslint/member-ordering": "warn",
        "@typescript-eslint/naming-convention": "warn",
        "@typescript-eslint/no-base-to-string": "warn",
        "@typescript-eslint/no-dynamic-delete": "warn",
        "@typescript-eslint/no-extra-non-null-assertion": "warn",
        "@typescript-eslint/no-extraneous-class": "warn",
        "@typescript-eslint/no-floating-promises": "warn",
        "@typescript-eslint/no-implied-eval": "warn",
        "@typescript-eslint/no-invalid-void-type": "warn",
        "@typescript-eslint/no-non-null-asserted-optional-chain": "warn",
        "@typescript-eslint/no-require-imports": "warn",
        "@typescript-eslint/no-throw-literal": "warn",
        "@typescript-eslint/no-unnecessary-boolean-literal-compare": "warn",
        "@typescript-eslint/no-unnecessary-condition": "warn",
        "@typescript-eslint/no-unnecessary-qualifier": "warn",
        "@typescript-eslint/prefer-as-const": "warn",
        "@typescript-eslint/prefer-for-of": "warn",
        "@typescript-eslint/prefer-function-type": "warn",
        "@typescript-eslint/prefer-nullish-coalescing": "warn",
        "@typescript-eslint/prefer-optional-chain": "warn",
        "@typescript-eslint/prefer-readonly": "warn",
        "@typescript-eslint/prefer-reduce-type-parameter": "warn",
        "@typescript-eslint/prefer-ts-expect-error": "warn",
        "@typescript-eslint/require-array-sort-compare": "warn",
        "@typescript-eslint/restrict-plus-operands": "warn",
        "@typescript-eslint/switch-exhaustiveness-check": "warn",
        "@typescript-eslint/unified-signatures": "warn",
        "array-bracket-newline": ["warn", { "multiline": true }],
        "array-bracket-spacing": "warn",
        "array-element-newline": ["warn", "consistent"],
        "array-callback-return": "warn",
        "arrow-body-style": "warn",
        "arrow-parens": "warn",
        "arrow-spacing": "warn",
        "block-spacing": "warn",
        "@typescript-eslint/brace-style": "warn",
        "comma-dangle": ["warn", "always-multiline"],
        "@typescript-eslint/comma-spacing": "warn",
        "comma-style": "warn",
        "computed-property-spacing": "warn",
        "default-case": "warn",
        // "default-case-last": "warn",
        "@typescript-eslint/default-param-last": "warn",
        "dot-location": ["warn", "property"],
        "@typescript-eslint/dot-notation": "warn",
        "eol-last": "warn",
        "eqeqeq": "warn",
        "function-call-argument-newline": ["warn", "consistent"],
        "@typescript-eslint/func-call-spacing": "warn",
        "function-paren-newline": "warn",
        "func-names": "warn",
        "func-style": ["warn", "declaration"],
        "generator-star-spacing": ["warn", "after"],
        "grouped-accessor-pairs": ["warn", "getBeforeSet"],
        "guard-for-in": "warn",
        "jsx-quotes": "warn",
        "key-spacing": "warn",
        "@typescript-eslint/keyword-spacing": "warn",
        "linebreak-style": "warn",
        "lines-between-class-members": "warn",
        "max-classes-per-file": "warn",
        "multiline-comment-style": "warn",
        "new-cap": "warn",
        "new-parens": "warn",
        "no-alert": "warn",
        "no-bitwise": "warn",
        "no-caller": "warn",
        "no-class-assign": "warn",
        "no-cond-assign": "warn",
        "no-console": "warn",
        "no-constructor-return": "warn",
        "no-debugger": "warn",
        "no-div-regex": "warn",
        "@typescript-eslint/no-dupe-class-members": "warn",
        "no-duplicate-imports": "warn",
        "no-else-return": "warn",
        "no-eq-null": "warn",
        "no-eval": "warn",
        "no-extend-native": "warn",
        "no-extra-bind": "warn",
        "@typescript-eslint/no-extra-parens": "warn",
        "@typescript-eslint/no-extra-semi": "warn",
        "no-implicit-coercion": "warn",
        "no-invalid-this": "warn",
        "no-iterator": "warn",
        "no-label-var": "warn",
        "no-lone-blocks": "warn",
        "no-lonely-if": "warn",
        "no-loop-func": "warn",
        "no-multi-spaces": "warn",
        "no-multiple-empty-lines": "warn",
        "no-new": "warn",
        "no-new-func": "warn",
        "no-new-object": "warn",
        "no-new-wrappers": "warn",
        "no-octal-escape": "warn",
        "no-param-reassign": "warn",
        "no-proto": "warn",
        "no-return-assign": "warn",
        "@typescript-eslint/return-await": "warn",
        "no-script-url": "warn",
        "no-self-compare": "warn",
        "no-sequences": "warn",
        "no-shadow": ["warn", {
            "builtinGlobals": true,
        }],
        "no-template-curly-in-string": "warn",
        "no-trailing-spaces": "warn",
        "no-undef-init": "warn",
        "no-unmodified-loop-condition": "warn",
        "no-unneeded-ternary": "warn",
        "@typescript-eslint/no-unused-expressions": "warn",
        "@typescript-eslint/no-unused-vars": ["warn", {
            "args": "all",
            "argsIgnorePattern": "^_"
        }],
        // "no-useless-backreference": "warn",
        "no-useless-call": "warn",
        "no-useless-catch": "warn",
        "no-useless-computed-key": "warn",
        "no-useless-concat": "warn",
        "@typescript-eslint/no-useless-constructor": "warn",
        "no-useless-rename": "warn",
        "no-useless-return": "warn",
        "no-void": "warn",
        "no-warning-comments": "warn",
        "no-whitespace-before-property": "warn",
        "object-curly-newline": ["warn", { "consistent": true }],
        "object-curly-spacing": ["warn", "always"],
        "object-shorthand": "warn",
        "one-var-declaration-per-line": "warn",
        "operator-assignment": "warn",
        "operator-linebreak": "warn",
        "prefer-arrow-callback": "warn",
        "prefer-const": "warn",
        "prefer-destructuring": "warn",
        "prefer-exponentiation-operator": "warn",
        "prefer-named-capture-group": "warn",
        "prefer-numeric-literals": "warn",
        "prefer-object-spread": "warn",
        "prefer-promise-reject-errors": "warn",
        "prefer-regex-literals": "warn",
        "prefer-rest-params": "warn",
        "prefer-spread": "warn",
        "prefer-template": "warn",
        "quote-props": ["warn", "as-needed"],
        "@typescript-eslint/quotes": "warn",
        "radix": "warn",
        "require-atomic-updates": "warn",
        "require-unicode-regexp": "warn",
        "rest-spread-spacing": "warn",
        "@typescript-eslint/semi": "warn",
        "semi-spacing": "warn",
        "semi-style": "warn",
        "sort-imports": ["warn", { "ignoreDeclarationSort": true }],
        "space-before-blocks": "warn",
        "@typescript-eslint/space-before-function-paren": ["warn", {
            "named": "never",
        }],
        "space-in-parens": "warn",
        "space-infix-ops": "warn",
        "space-unary-ops": "warn",
        "spaced-comment": "warn",
        "switch-colon-spacing": "warn",
        "symbol-description": "warn",
        "template-curly-spacing": "warn",
        "template-tag-spacing": "warn",
        "unicode-bom": "warn",
        "vars-on-top": "warn",
        "wrap-iife": "warn",
        "yield-star-spacing": "warn",
        "yoda": ["warn", "never", { "exceptRange": true }],
    },
}
