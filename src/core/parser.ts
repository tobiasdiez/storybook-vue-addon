import type { ElementNode } from '@vue/compiler-core'
import type { SFCDescriptor } from 'vue/compiler-sfc'
import {
  compileScript,
  compileTemplate,
  parse as parseSFC,
} from 'vue/compiler-sfc'

import { sanitize } from '@storybook/csf'

// import { NodeTypes } from '@vue/compiler-core'
// Doesn't work, for some reason, maybe https://github.com/vuejs/core/issues/1228
enum NodeTypes {
  ROOT = 0,
  ELEMENT = 1,
  TEXT = 2,
  COMMENT = 3,
  SIMPLE_EXPRESSION = 4,
  INTERPOLATION = 5,
  ATTRIBUTE = 6,
  DIRECTIVE = 7,
  COMPOUND_EXPRESSION = 8,
  IF = 9,
  IF_BRANCH = 10,
  FOR = 11,
  TEXT_CALL = 12,
  VNODE_CALL = 13,
  JS_CALL_EXPRESSION = 14,
  JS_OBJECT_EXPRESSION = 15,
  JS_PROPERTY = 16,
  JS_ARRAY_EXPRESSION = 17,
  JS_FUNCTION_EXPRESSION = 18,
  JS_CONDITIONAL_EXPRESSION = 19,
  JS_CACHE_EXPRESSION = 20,
  JS_BLOCK_STATEMENT = 21,
  JS_TEMPLATE_LITERAL = 22,
  JS_IF_STATEMENT = 23,
  JS_ASSIGNMENT_EXPRESSION = 24,
  JS_SEQUENCE_EXPRESSION = 25,
  JS_RETURN_STATEMENT = 26,
}

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
    template.ast?.children.filter((node) => node.type === NodeTypes.ELEMENT) ??
    []
  if (roots.length !== 1) {
    throw new Error('Expected exactly one <Stories> element as root.')
  }

  const root = roots[0]
  if (root.type !== NodeTypes.ELEMENT || root.tag !== 'Stories')
    throw new Error('Expected root to be a <Stories> element.')
  const meta = {
    title: extractTitle(root),
    component: extractComponent(root),
    tags: [],
  }

  const stories: ParsedStory[] = []
  for (const story of root.children ?? []) {
    if (story.type !== NodeTypes.ELEMENT || story.tag !== 'Story') continue

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
  if (prop && prop.type === NodeTypes.ATTRIBUTE) return prop.value?.content
}

function extractComponent(node: ElementNode) {
  const prop = extractProp(node, 'component')
  if (prop && prop.type === NodeTypes.DIRECTIVE)
    return prop.exp?.type === NodeTypes.SIMPLE_EXPRESSION
      ? prop.exp?.content.replace('_ctx.', '')
      : undefined
}

function extractPlay(node: ElementNode) {
  const prop = extractProp(node, 'play')
  if (prop && prop.type === NodeTypes.DIRECTIVE)
    return prop.exp?.type === NodeTypes.SIMPLE_EXPRESSION
      ? prop.exp?.content.replace('_ctx.', '')
      : undefined
}

// Minimal version of https://github.com/vitejs/vite/blob/57916a476924541dd7136065ceee37ae033ca78c/packages/plugin-vue/src/main.ts#L297
function resolveScript(descriptor: SFCDescriptor) {
  if (descriptor.script || descriptor.scriptSetup)
    return compileScript(descriptor, { id: 'test' })
}

function extractProp(node: ElementNode, name: string) {
  if (node.type === NodeTypes.ELEMENT) {
    return node.props.find(
      (prop) =>
        prop.name === name ||
        (prop.name === 'bind' &&
          prop.type === NodeTypes.DIRECTIVE &&
          prop.arg?.type === NodeTypes.SIMPLE_EXPRESSION &&
          prop.arg?.content === name)
    )
  }
}
