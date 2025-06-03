/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended', // ← чтобы Prettier и ESLint не конфликтовали
  ],
  rules: {
    // 1) Всегда ставим пустую строку перед if / try / return / throw
    'padding-line-between-statements': [
      'error',
      // пробел после любой инструкции перед if / try
      { blankLine: 'always', prev: '*', next: ['if', 'try'] },
      // пробел после любой инструкции перед return / throw
      { blankLine: 'always', prev: '*', next: ['return', 'throw'] },
    ],
  },
};
