import type { ElementNode, NodeTypes as _NodeTypes } from '@vue/compiler-core'
import { TS_NODE_TYPES } from '@vue/compiler-dom'
import type { SFCDescriptor, SFCScriptBlock } from 'vue/compiler-sfc'
import {
  MagicString,
  compileScript,
  compileTemplate,
  parse as parseSFC,
} from 'vue/compiler-sfc'

import { CallExpression, Node } from '@babel/types'

import { sanitize } from '@storybook/csf'
// Taken from https://github.com/vuejs/core/blob/2857a59e61c9955e15553180e7480aa40714151c/packages/compiler-sfc/src/script/utils.ts#L35-L42
export function unwrapTSNode(node: Node): Node {
  if (TS_NODE_TYPES.includes(node.type)) {
    return unwrapTSNode((node as any).expression)
  } else {
    return node
  }
}
export function isCallOf(
  node: Node | null | undefined,
  test: string | ((id: string) => boolean) | null | undefined,
): node is CallExpression {
  return !!(
    node &&
    test &&
    node.type === 'CallExpression' &&
    node.callee.type === 'Identifier' &&
    (typeof test === 'string'
      ? node.callee.name === test
      : test(node.callee.name))
  )
}

// import { NodeTypes } from '@vue/compiler-core'
// Doesn't work, for some reason, maybe https://github.com/vuejs/core/issues/1228
const ELEMENT = 1 as _NodeTypes.ELEMENT
const SIMPLE_EXPRESSION = 4 as _NodeTypes.SIMPLE_EXPRESSION
const ATTRIBUTE = 6 as _NodeTypes.ATTRIBUTE
const DIRECTIVE = 7 as _NodeTypes.DIRECTIVE

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
  const parsedTemplate = parseTemplate(descriptor.template.content)
  let { meta } = parsedTemplate
  const { stories } = parsedTemplate
  if (resolvedScript) {
    const { meta: scriptMeta } = parseScript(resolvedScript)
    if (meta && scriptMeta) {
      throw new Error('Cannot define meta by both <Stories> and defineMeta')
    }
    if (scriptMeta) {
      meta = scriptMeta
    }
  }
  const docsBlock = descriptor.customBlocks?.find(
    (block) => block.type === 'docs',
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
  meta?: ParsedMeta
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
    template.ast?.children.filter((node) => node.type === ELEMENT) ?? []
  if (roots.length === 0) {
    throw new Error(
      'No root element found in template, must be <Stories> or <Story>',
    )
  }

  const root = roots[0]
  let meta
  let storyNodes = roots
  if (root.type === ELEMENT && root.tag === 'Stories') {
    meta = {
      title: extractTitle(root),
      component: extractComponent(root),
      tags: [],
    }
    storyNodes = root.children ?? []
  }

  const stories: ParsedStory[] = []
  for (const story of storyNodes ?? []) {
    if (story.type !== ELEMENT || story.tag !== 'Story') {
      throw new Error(
        'Only <Story> elements are allowed as children of <Stories> or as root element',
      )
    }

    const title = extractTitle(story)
    if (!title) throw new Error('Story is missing a title')

    const play = extractPlay(story)

    const storyTemplate = parseSFC(
      story.loc.source
        .replace(/<Story/, '<template')
        .replace(/<\/Story>/, '</template>'),
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
  if (prop && prop.type === ATTRIBUTE) return prop.value?.content
}

function extractComponent(node: ElementNode) {
  const prop = extractProp(node, 'component')
  if (prop && prop.type === DIRECTIVE)
    return prop.exp?.type === SIMPLE_EXPRESSION
      ? prop.exp?.content.replace('_ctx.', '')
      : undefined
}

function extractPlay(node: ElementNode) {
  const prop = extractProp(node, 'play')
  if (prop && prop.type === DIRECTIVE)
    return prop.exp?.type === SIMPLE_EXPRESSION
      ? prop.exp?.content.replace('_ctx.', '')
      : undefined
}

// Minimal version of https://github.com/vitejs/vite/blob/57916a476924541dd7136065ceee37ae033ca78c/packages/plugin-vue/src/main.ts#L297
function resolveScript(descriptor: SFCDescriptor) {
  if (descriptor.script || descriptor.scriptSetup)
    return compileScript(descriptor, { id: 'test' })
}

function extractProp(node: ElementNode, name: string) {
  if (node.type === ELEMENT) {
    return node.props.find(
      (prop) =>
        prop.name === name ||
        (prop.name === 'bind' &&
          prop.type === DIRECTIVE &&
          prop.arg?.type === SIMPLE_EXPRESSION &&
          prop.arg?.content === name),
    )
  }
}

interface ScriptCompileContext {
  hasDefineMetaCall: boolean
  meta?: ParsedMeta
}
function parseScript(resolvedScript: SFCScriptBlock): { meta?: ParsedMeta } {
  if (!resolvedScript.scriptSetupAst) {
    return { meta: undefined }
  }
  const ctx: ScriptCompileContext = {
    hasDefineMetaCall: false,
  }
  const content = new MagicString(resolvedScript.content)
  for (const node of resolvedScript.scriptSetupAst) {
    if (node.type === 'ExpressionStatement') {
      const expr = unwrapTSNode(node.expression)
      // process `defineMeta` calls
      if (processDefineMeta(ctx, expr)) {
        // The ast is sadly out of sync with the content, so we have to find the meta call in the content
        const startOffset = content.original.indexOf('defineMeta')
        content.remove(startOffset, node.end! - node.start! + startOffset)
      }
    }
  }
  resolvedScript.content = content.toString()
  return ctx.meta ? { meta: ctx.meta } : {}
}

// Similar to https://github.com/vuejs/core/blob/2857a59e61c9955e15553180e7480aa40714151c/packages/compiler-sfc/src/script/defineEmits.ts
function processDefineMeta(ctx: ScriptCompileContext, node: Node) {
  const defineMetaName = 'defineMeta'
  if (!isCallOf(node, defineMetaName)) {
    return false
  }
  if (ctx.hasDefineMetaCall) {
    throw new Error(`duplicate ${defineMetaName}() call at ${node.start}`)
  }
  ctx.hasDefineMetaCall = true
  const metaDecl = unwrapTSNode(node.arguments[0])
  const meta: ParsedMeta = {
    tags: [],
  }
  if (metaDecl.type === 'ObjectExpression') {
    for (const prop of metaDecl.properties) {
      if (prop.type === 'ObjectProperty') {
        const key = unwrapTSNode(prop.key)
        const valueNode = unwrapTSNode(prop.value)
        if (key.type === 'Identifier') {
          const value =
            valueNode.type === 'StringLiteral'
              ? valueNode.value
              : valueNode.type === 'Identifier'
              ? valueNode.name
              : undefined
          if (!value) {
            throw new Error(
              `defineMeta() ${key.name} must be a string literal or identifier`,
            )
          }
          if (key.name === 'title') {
            meta.title = value
          } else if (key.name === 'component') {
            meta.component = value
          } else if (key.name === 'tags') {
            meta.tags = value.split(',').map((tag) => tag.trim())
          }
        }
      }
    }
  }
  ctx.meta = meta

  return true
}
