import { createUnplugin } from 'unplugin'
import { transform as transformVue } from './core/transform'
import type { Options } from './types'

export default createUnplugin<Options>(_options => ({
  name: 'unplugin-starter',
  enforce: 'pre',
  transformInclude(id) {
    return id.endsWith('.stories.vue')
  },
  transform(code) {
    return transformVue(code)
  },
}))
