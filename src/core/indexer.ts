import { IndexerOptions, IndexInput } from '@storybook/types'
import { parse } from './parser'
import fs from 'node:fs/promises'

export async function indexer(
  fileName: string,
  options: IndexerOptions,
): Promise<IndexInput[]> {
  const code = (await fs.readFile(fileName, { encoding: 'utf8' })).toString()
  return indexerCode(code, { ...options, fileName })
}

export function indexerCode(
  code: string,
  { makeTitle, fileName }: IndexerOptions & { fileName: string },
): IndexInput[] {
  const { meta, stories, docs } = parse(code)
  const indexedStories: IndexInput[] = stories.map(({ id, title }) => ({
    type: 'story',
    importPath: fileName,
    exportName: id,
    name: title,
    title: makeTitle(meta.title),
    tags: meta.tags,
  }))
  if (docs) {
    indexedStories.push({
      type: 'docs',
      importPath: fileName,
      exportName: 'docs',
      name: 'Docs',
      title: makeTitle(meta.title),
      tags: meta.tags,
    })
  }
  return indexedStories
}
