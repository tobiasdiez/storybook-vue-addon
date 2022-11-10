import type { StorybookViteConfig } from '@storybook/builder-vite'
import VitePlugin from './vite'

export const viteFinal: StorybookViteConfig['viteFinal'] = (config) => {
  config.plugins = config.plugins || []
  config.plugins.unshift(VitePlugin({}))
  return config
}
