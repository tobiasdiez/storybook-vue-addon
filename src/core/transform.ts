import type { SFCDescriptor, SFCScriptBlock } from 'vue/compiler-sfc'
import { compileScript, compileTemplate, parse, rewriteDefault } from 'vue/compiler-sfc'
import type { ElementNode } from '@vue/compiler-core'

/**
 * Transforms a vue single-file-component into Storybook's Component Story Format (CSF).
 */
export function transform(code: string) {
  const { descriptor } = parse(code)
  if (descriptor.template === null)
    throw new Error('No template found in SFC')

  let result = ''
  const resolvedScript = resolveScript(descriptor)
  if (resolvedScript) {
    result += rewriteDefault(resolvedScript.content, '_sfc_main')
    result += '\n'
  }
  else {
    result += 'const _sfc_main = {}\n'
  }
  result += transformTemplate(descriptor.template.content, resolvedScript)
  return result

  /*
  return `
    import MyButton from './Button.vue';
    import { userEvent, within } from '@storybook/testing-library';
    import { expect } from '@storybook/jest';

    export default {
      title: 'Example/ButtonTest',
      component: MyButton,
      argTypes: {
        backgroundColor: { control: 'color' },
        size: {
          control: { type: 'select', options: ['small', 'medium', 'large'] },
        },
        onClick: {},
      },
    };

    const Template = (args) => ({
      components: { MyButton },
      setup() {
        return { args };
      },
      template: '<my-button v-bind="args" />',
    });

    export const Primary = Template.bind({});
    Primary.args = {
      primary: true,
      label: 'Button',
    };
    Primary.play = async ({ args, canvasElement }) => {
      const canvas = within(canvasElement);
      const button = canvas.getByRole('button');
      await userEvent.click(button);
      await expect(args.onClick).toHaveBeenCalled();
    };

    export const Secondary = Template.bind({});
    Secondary.args = {
      label: 'Button',
    };

    export const Large = Template.bind({});
    Large.args = {
      size: 'large',
      label: 'Button',
    };

    export const Small = Template.bind({});
    Small.args = {
      size: 'small',
      label: 'Button',
    };
    `
    */
}

function transformTemplate(content: string, resolvedScript?: SFCScriptBlock) {
  const template = compileTemplate({
    source: content,
    filename: 'test.vue',
    id: 'test',
    /* compilerOptions: {
      nodeTransforms: [extractTitle, replaceStoryNode],
    }, */
  })

  const roots = template.ast?.children ?? []
  if (roots.length !== 1)
    throw new Error('Expected exactly one <Stories> element as root.')

  const root = roots[0]
  if (root.type !== 1 || root.tag !== 'Stories')
    throw new Error('Expected root to be a <Stories> element.')

  let result = generateDefaultImport(root)
  for (const story of root.children ?? []) {
    if (story.type !== 1 || story.tag !== 'Story')
      continue

    result += generateStoryImport(story, resolvedScript)
  }
  return result
}

function generateDefaultImport(root: ElementNode) {
  const title = extractTitle(root)
  return `export default {
    ${title ? `title: '${title}',` : ''}
    //component: MyComponent,
    //decorators: [ ... ],
    //parameters: { ... }
    }
    `
}

function extractTitle(node: ElementNode) {
  if (node.type === 1) {
    const titleProp = node.props.find(prop => prop.name === 'title')
    if (titleProp && titleProp.type === 6)
      return titleProp.value?.content
  }
}

function generateStoryImport(story: ElementNode, resolvedScript?: SFCScriptBlock) {
  const title = extractTitle(story)
  if (!title)
    throw new Error('Story is missing a title')
  const storyTemplate = parse(story.loc.source.replace(/<Story/, '<template').replace(/<\/Story>/, '</template>')).descriptor.template?.content
  if (storyTemplate === undefined)
    throw new Error('No template found in Story')

  const { code } = compileTemplate({ source: storyTemplate.trim(), filename: 'test.vue', id: 'test', compilerOptions: { bindingMetadata: resolvedScript?.bindings } })
  const renderFunction = code.replace('export function render', `function render${title}`)

  // Each named export is a story, has to return a Vue ComponentOptionsBase
  return `
    ${renderFunction}
    export const ${title} = () => Object.assign({render: render${title}}, _sfc_main)`
}

// Minimal version of https://github.com/vitejs/vite/blob/57916a476924541dd7136065ceee37ae033ca78c/packages/plugin-vue/src/main.ts#L297
function resolveScript(descriptor: SFCDescriptor) {
  if (descriptor.script || descriptor.scriptSetup)
    return compileScript(descriptor, { id: 'test' })
}
