import type { Options } from './types'
import unplugin from '.'
import { Nuxt } from '@nuxt/schema'

export default function (options: Options = {}, nuxt: Nuxt) {
  // install webpack plugin
  nuxt.hook('webpack:config', (configs) => {
    configs.forEach((config) => {
      config.plugins = config.plugins || []
      config.plugins.unshift(unplugin.webpack(options))
    })
  })

  // install vite plugin
  nuxt.hook('vite:extendConfig', (config) => {
    config.plugins = config.plugins || []
    config.plugins.push(unplugin.vite(options))
  })
}
