import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default tseslint.config(
  // 1. Recommended JS & TS configs
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // 2. Custom configuration for your files
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: {
      prettier: prettierPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node, // Added Node since it's a Node project
      },
      parser: tseslint.parser, // Use the correct TS parser
      sourceType: "module",
    },
    rules: {
      // Disable rules that conflict with Prettier
      ...prettierConfig.rules,
      
      // Your custom rules
      "@typescript-eslint/no-unused-vars": "warn",
      "no-console": "warn",
      
      // Let Prettier handle formatting as an ESLint rule
      "prettier/prettier": "error",
    },
  },
  
  // 3. Ignore build artifacts
  {
    ignores: ["dist/", "node_modules/"],
  }
);