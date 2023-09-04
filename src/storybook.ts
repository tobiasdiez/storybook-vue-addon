import type { StorybookConfig } from '@storybook/vue3-vite'
import VitePlugin from './vite'
import { indexer } from './core/indexer'
import type { StoryIndexer } from '@storybook/types'

export const viteFinal: StorybookConfig['viteFinal'] = (config) => {
  config.plugins = config.plugins || []
  config.plugins.unshift(VitePlugin({}))
  return config
}

export const storyIndexers = (indexers: StoryIndexer[]): StoryIndexer[] => {
  return [
    {
      test: /\.stories\.vue$/,
      indexer,
    },
    ...(indexers || []),
  ]
}
