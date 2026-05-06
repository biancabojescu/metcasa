import eslintConfigPrettier from "eslint-config-prettier/flat";
import prettierPlugin from "eslint-plugin-prettier";
import withNuxt from "./.nuxt/eslint.config.mjs";

// export the default configuration for Nuxt.js always WITHNUXT to include all rules for js,ts,vue files
export default withNuxt(
  {
    ignores: ["node_modules/", ".nuxt/", "dist/", "public/"],
  },
  {
    plugins: { prettier: prettierPlugin },
    rules: {
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },
  eslintConfigPrettier,
)
  // use the overrides key to disable some rules that conflict with Nuxt.js SPECIFICALLY for each package of rules
  .override("nuxt/vue/rules", {
    rules: {
      "vue/html-self-closing": "off",
      "vue/multi-word-component-names": "off",
    },
  });
