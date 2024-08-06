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
  // If there are docs, we add an autodocs tag
  // This is because the storybook index generator doesn't support "type: docs" yet
  // https://github.com/storybookjs/storybook/blob/b94ead30bd1798648bc674bce61ba841508b6bbc/code/core/src/core-server/utils/StoryIndexGenerator.ts#L369
  // So we need to add the tag so that we hit
  // https://github.com/storybookjs/storybook/blob/b94ead30bd1798648bc674bce61ba841508b6bbc/code/core/src/core-server/utils/StoryIndexGenerator.ts#L389-L405
  // Something like the following would be more appropriate
  // if (docs) {
  //   indexedStories.push({
  //     type: 'docs',
  //     importPath: fileName,
  //     exportName: 'docs',
  //     name: 'Docs',
  //     title: makeTitle(meta.title),
  //     tags: meta.tags,
  //   })
  // }
  // TODO: Properly handle docs once the storybook index generator supports it
  // https://github.com/storybookjs/storybook/issues/28803
  const tags = meta.tags || []
  if (docs) {
    tags.push('autodocs')
  }
  const indexedStories: IndexInput[] = stories.map(({ id, title }) => ({
    type: 'story',
    importPath: fileName,
    exportName: id,
    name: title,
    title: makeTitle(meta.title),
    tags: tags,
  }))
  return indexedStories
}
