import type { StorybookConfig } from '@storybook/vue3-vite'
import VitePlugin from './vite'
import { indexer } from './core/indexer'
import { definePreviewAddon } from 'storybook/internal/csf'

export const viteFinal: StorybookConfig['viteFinal'] = (config) => {
  config.plugins = config.plugins || []
  config.plugins.unshift(VitePlugin({}))
  return config
}

// See https://storybook.js.org/docs/api/main-config/main-config-indexers
export const experimental_indexers: StorybookConfig['experimental_indexers'] = (
  indexers,
) => {
  return [
    {
      test: /\.stories\.vue$/,
      index: indexer,
      createIndex: indexer,
    },
    ...(indexers || []),
  ]
}

export default () => definePreviewAddon({})
