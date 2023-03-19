import { IndexedCSFFile, IndexerOptions } from '@storybook/types'
import { parse } from './parser'
import fs from 'fs/promises'
import { toId } from '@storybook/csf'
import { EXPORT_PREFIX } from './transform'

export async function indexer(
  fileName: string,
  options: IndexerOptions
): Promise<IndexedCSFFile> {
  const code = (await fs.readFile(fileName, { encoding: 'utf-8' })).toString()
  return indexerCode(code, options)
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
        id: EXPORT_PREFIX + toId(meta.title || 'default', id),
        name: title,
      })),
  }
}
