// .eslintrc.js
module.exports = {
  root: true,
  extends: ["universe/native"],
  rules: {
    "import/order": [
      "off",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          ["parent", "sibling", "index"],
        ],
        "newlines-between": "never", // Set this option to "never"
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
    "no-console": "warn",
    "prettier/prettier": [
      "warn",
      {
        endOfLine: "auto",
      },
    ],
    "sort-imports": "off",
    "no-empty": "off",
    "no-unused-vars": "warn",
    "object-shorthand": "off",
    eqeqeq: "off",
    curly: "off",
  },
};
