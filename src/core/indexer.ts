import { IndexedCSFFile, IndexerOptions, IndexedStory } from '@storybook/types'
import { parse } from './parser'
import fs from 'node:fs/promises'
import { toId } from '@storybook/csf'

export async function indexer(
  fileName: string,
  options: IndexerOptions,
): Promise<IndexedCSFFile> {
  const code = (await fs.readFile(fileName, { encoding: 'utf8' })).toString()
  return indexerCode(code, options)
}

export function indexerCode(
  code: string,
  { makeTitle }: IndexerOptions,
): IndexedCSFFile {
  const { meta, stories, docs } = parse(code)
  const indexedStories: IndexedStory[] = stories
    // .filter(story => !story.template)
    .map(({ id, title }) => ({
      id: toId(meta.title || 'default', id),
      name: title,
    }))
  if (docs) {
    indexedStories.push({
      id: toId(meta.title || 'default', 'docs'),
      name: 'Docs',
      parameters: {
        // Otherwise it is added as an ordinary story: https://github.com/storybookjs/storybook/blob/224e9b807ee2359504d7b6ae15907fa80c8ee1b3/code/lib/core-server/src/utils/StoryIndexGenerator.ts#L260-L263
        docsOnly: true,
      },
    })
    // Need to hit https://github.com/storybookjs/storybook/blob/224e9b807ee2359504d7b6ae15907fa80c8ee1b3/code/lib/core-server/src/utils/StoryIndexGenerator.ts#L273-L289
    meta.tags.push('stories-mdx')
  }
  return {
    meta: { title: makeTitle(meta.title), tags: meta.tags },
    stories: indexedStories,
  }
}
