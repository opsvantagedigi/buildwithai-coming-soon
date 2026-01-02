module.exports = {
  stories: ['../src/components/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials'
  ],
  framework: {
    name: '@storybook/react',
    options: {}
  },
  docs: {
    autodocs: true,
  }
}
