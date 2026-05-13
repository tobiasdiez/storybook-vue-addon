import type { Options } from './types'

import unplugin from '.'

// oxlint-disable-next-line no-underscore-dangle
const astro_ = (options: Options) => ({
  hooks: {
    'astro:config:setup': async (astro: any) => {
      astro.config.vite.plugins ||= []
      astro.config.vite.plugins.push(unplugin.vite(options))
    },
  },
  name: 'unplugin-starter',
})
export default astro_
