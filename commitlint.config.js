/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Allow Chinese in subject
    'subject-case': [0],
    // Max subject length
    'header-max-length': [2, 'always', 100],
  },
};
