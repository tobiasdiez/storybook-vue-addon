import Inspect from 'vite-plugin-inspect'

export default {
  stories: [
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx|vue)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '../../../src/storybook.ts',
  ],
  framework: '@storybook/vue3',
  core: {
    builder: '@storybook/builder-vite',
  },
  features: {
    storyStoreV7: false,
  },
  async viteFinal(config, { configType }) {
    // Inspect result can be found at subroute '/__inspect', e.g. http://127.0.0.1:6006/__inspect/
    config.plugins.unshift(Inspect())

    return config
  },
}
