/** @type {import('lint-staged').Config} */
const config = {
  '*.{ts,tsx,js,jsx,cjs,mjs,html,css,md,mdx,yml,yaml,json,jsonc}': 'prettier --ignore-unknown --write',
};

export default config;
