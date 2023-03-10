import { IndexedCSFFile, IndexerOptions } from '@storybook/types'
import { parse } from './parser'
import fs from 'fs/promises'

export async function indexer(
  fileName: string,
  options: IndexerOptions
): Promise<IndexedCSFFile> {
  const code = (await fs.readFile(fileName, { encoding: 'utf-8' })).toString()
  const { meta, stories } = indexerCode(code, options)
  return {
    meta,
    stories: stories.map((story) => ({
      ...story,
      id: `${fileName}--${story.id}`,
    })),
  }
}

export function indexerCode(
  code: string,
  { makeTitle }: IndexerOptions
): IndexedCSFFile {
  const { meta, stories } = parse(code)
  return {
    meta: { title: makeTitle(meta.title) },
    stories: stories
      // .filter(story => !story.template)
      .map(({ id, title }) => ({
        id,
        name: title,
      })),
  }
}
