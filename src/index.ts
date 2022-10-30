import { createUnplugin } from 'unplugin'
import { transform as transformVue } from './core/transform'
import type { Options } from './types'

// We a custom type so that the vue plugin is ignoring the "main" import
const STORIES_INTERNAL_SUFFIX = '?vue&type=stories'
const STORIES_PUBLIC_SUFFIX = '.stories.vue'

export default createUnplugin<Options>(_options => ({
  name: 'unplugin-starter',
  enforce: 'pre',
  async resolveId(source, importer, options) {
    if (source.endsWith(STORIES_PUBLIC_SUFFIX)) {
      // Determine what the actual entry would have been. We need "skipSelf"
      // to avoid an infinite loop.
      const resolution = await this.resolve(source, importer, { skipSelf: true, ...options })

      // If it cannot be resolved or is external, just return it so that
      // Rollup can display an error
      if (!resolution || resolution.external)
        return resolution

      console.log('resolveIdStory', resolution)
      return {
        ...resolution,
        id: resolution.id + STORIES_INTERNAL_SUFFIX,
      }
    }
  },
  transformInclude(id) {
    console.log('transformInclude', id)
    return id.endsWith(STORIES_INTERNAL_SUFFIX)
  },
  transform(code) {
    console.log('transform', code)
    return transformVue(code)
  },
}))
