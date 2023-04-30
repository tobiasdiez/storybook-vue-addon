import type { SFCDescriptor } from 'vue/compiler-sfc'
import {
  compileScript,
  compileTemplate,
  parse as parseSFC,
} from 'vue/compiler-sfc'
import type { ElementNode } from '@vue/compiler-core'

import { sanitize } from '@storybook/csf'

export interface ParsedMeta {
  title?: string
  component?: string
  tags: string[]
}

export interface ParsedStory {
  id: string
  title: string
  template: string
  play?: string
}

export function parse(code: string) {
  const { descriptor } = parseSFC(code)
  if (descriptor.template === null) throw new Error('No template found in SFC')

  const resolvedScript = resolveScript(descriptor)
  const { meta, stories } = parseTemplate(descriptor.template.content)
  const docsBlock = descriptor.customBlocks?.find(
    (block) => block.type === 'docs'
  )
  const docs = docsBlock?.content.trim()
  return {
    resolvedScript,
    meta,
    stories,
    docs,
  }
}

function parseTemplate(content: string): {
  meta: ParsedMeta
  stories: ParsedStory[]
} {
  const template = compileTemplate({
    source: content,
    filename: 'test.vue',
    id: 'test',
    /* compilerOptions: {
        nodeTransforms: [extractTitle, replaceStoryNode],
      }, */
  })

  const roots =
    template.ast?.children.filter(
      (node) => node.type === 1 /* NodeTypes.ELEMENT */
    ) ?? []
  if (roots.length !== 1) {
    throw new Error('Expected exactly one <Stories> element as root.')
  }

  const root = roots[0]
  if (root.type !== 1 || root.tag !== 'Stories')
    throw new Error('Expected root to be a <Stories> element.')
  const meta = {
    title: extractTitle(root),
    component: extractComponent(root),
    tags: [],
  }

  const stories: ParsedStory[] = []
  for (const story of root.children ?? []) {
    if (story.type !== 1 || story.tag !== 'Story') continue

    const title = extractTitle(story)
    if (!title) throw new Error('Story is missing a title')

    const play = extractPlay(story)

    const storyTemplate = parseSFC(
      story.loc.source
        .replace(/<Story/, '<template')
        .replace(/<\/Story>/, '</template>')
    ).descriptor.template?.content
    if (storyTemplate === undefined)
      throw new Error('No template found in Story')
    stories.push({
      id: sanitize(title).replace(/[^a-zA-Z0-9]/g, '_'),
      title,
      play,
      template: storyTemplate,
    })
  }
  return {
    meta,
    stories,
  }
}

function extractTitle(node: ElementNode) {
  const prop = extractProp(node, 'title')
  if (prop && prop.type === 6) return prop.value?.content
}

function extractComponent(node: ElementNode) {
  const prop = extractProp(node, 'component')
  if (prop && prop.type === 7)
    return prop.exp?.type === 4
      ? prop.exp?.content.replace('_ctx.', '')
      : undefined
}

function extractPlay(node: ElementNode) {
  const prop = extractProp(node, 'play')
  if (prop && prop.type === 7)
    return prop.exp?.type === 4
      ? prop.exp?.content.replace('_ctx.', '')
      : undefined
}

// Minimal version of https://github.com/vitejs/vite/blob/57916a476924541dd7136065ceee37ae033ca78c/packages/plugin-vue/src/main.ts#L297
function resolveScript(descriptor: SFCDescriptor) {
  if (descriptor.script || descriptor.scriptSetup)
    return compileScript(descriptor, { id: 'test' })
}

function extractProp(node: ElementNode, name: string) {
  if (node.type === 1) {
    return node.props.find(
      (prop) =>
        prop.name === name ||
        (prop.name === 'bind' &&
          prop.type === 7 &&
          prop.arg?.type === 4 &&
          prop.arg?.content === name)
    )
  }
}
