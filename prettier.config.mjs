/** @type {import('prettier').Config} */
const config = {
  plugins: ['@prettier/plugin-oxc'],
  trailingComma: 'es5',
  semi: true,
  singleQuote: true,
  overrides: [
    {
      files: ['*.yaml', '*.yml'],
      options: {
        bracketSpacing: false,
      },
    },
  ],
};

export default config;
