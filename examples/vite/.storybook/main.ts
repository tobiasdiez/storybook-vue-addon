import Inspect from 'vite-plugin-inspect'
import Unplugin from '../../../src/vite'
import { mergeConfig } from 'vite'


export default {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx|vue)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions"
  ],
  "framework": "@storybook/vue3",
  "core": {
    "builder": "@storybook/builder-vite"
  },
  "features": {
    "storyStoreV7": false
  },
  async viteFinal(config, { configType }) {
    // Inspect result can be found at subroute '/__inspect', e.g. http://127.0.0.1:6006/__inspect/
    config.plugins.unshift(Inspect(), Unplugin())
    
    return mergeConfig(config, {
      // Other customizations: https://github.com/storybookjs/builder-vite#customize-vite-config
      // ...
    });
  },
}
