// eslint.config.ts
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginPrettier from "eslint-plugin-prettier";
import jsoncParser from "jsonc-eslint-parser";

export default tseslint.config(
    // Base TS + React + Prettier
    {
        files: ["**/*.{ts,tsx}"],
        extends: [...tseslint.configs.recommended],
        plugins: {
            react: pluginReact,
            prettier: pluginPrettier,
        },
        languageOptions: {
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                ecmaFeatures: { jsx: true },
            },
        },
        rules: {
            "@typescript-eslint/no-unused-vars": "warn",
            "@typescript-eslint/no-explicit-any": "warn",
            "react/prop-types": "off",
            "react/react-in-jsx-scope": "off",
            "prettier/prettier": [
                "warn",
                {
                    useTabs: true,
                    tabWidth: 4,
                    singleQuote: false,
                    trailingComma: "all",
                    endOfLine: "auto",
                },
            ],
        },
        settings: {
            react: { version: "detect" },
        },
    },

    // JSON config
    {
        files: ["**/*.{json,jsonc}"],
        languageOptions: {
            parser: jsoncParser,
        },
        plugins: {
            prettier: pluginPrettier,
        },
        rules: {
            "prettier/prettier": [
                "warn",
                {
                    useTabs: true,
                    tabWidth: 4,
                    singleQuote: false,
                    trailingComma: "all",
                    endOfLine: "auto",
                },
            ],
        },
    },
);
