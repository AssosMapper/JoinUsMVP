module.exports = {
  extends: [
    'stylelint-config-recommended-vue',
    'stylelint-config-standard-scss',
  ],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen',
        ],
      },
    ],
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
        ],
      },
    ],
  },
};