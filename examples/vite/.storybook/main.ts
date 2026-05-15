import Inspect from 'vite-plugin-inspect'
export default {
  addons: ['@storybook/addon-links', 'storybook-vue-addon', '@storybook/addon-docs'],
  features: {},
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx|vue)'],
  async viteFinal(config, { _configType }) {
    // Inspect result can be found at subroute '/__inspect', e.g. http://127.0.0.1:6006/__inspect/
    config.plugins.unshift(Inspect())
    return config
  },
}
