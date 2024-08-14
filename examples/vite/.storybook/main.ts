import Inspect from 'vite-plugin-inspect'
export default {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx|vue)'],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    'storybook-vue-addon',
    '@storybook/addon-mdx-gfm',
  ],

  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },

  features: {},

  async viteFinal(config, { _configType }) {
    // Inspect result can be found at subroute '/__inspect', e.g. http://127.0.0.1:6006/__inspect/
    config.plugins.unshift(Inspect())
    return config
  },

  docs: {
    autodocs: true,
  },
}
