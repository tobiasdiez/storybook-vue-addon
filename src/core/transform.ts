import type { SFCScriptBlock } from 'vue/compiler-sfc'
import { compileTemplate, rewriteDefault } from 'vue/compiler-sfc'
import { format as prettierFormat } from 'prettier'
import { parse, ParsedMeta, ParsedStory } from './parser'

/**
 * Transforms a vue single-file-component into Storybook's Component Story Format (CSF).
 */
export function transform(code: string) {
  let result = ''
  const { resolvedScript, meta, stories } = parse(code)
  if (resolvedScript) {
    result += rewriteDefault(resolvedScript.content, '_sfc_main')
    result += '\n'
  } else {
    result += 'const _sfc_main = {}\n'
  }
  result += transformTemplate({ meta, stories }, resolvedScript)
  result = organizeImports(result)
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

function transformTemplate(
  { meta, stories }: { meta: ParsedMeta; stories: ParsedStory[] },
  resolvedScript?: SFCScriptBlock
) {
  let result = generateDefaultImport(meta)
  for (const story of stories) {
    result += generateStoryImport(story, resolvedScript)
  }
  return result
}

function generateDefaultImport({ title, component }: ParsedMeta) {
  return `export default {
    ${title ? `title: '${title}',` : ''}
    ${component ? `component: ${component},` : ''}
    //decorators: [ ... ],
    //parameters: { ... }
    }
    `
}

function generateStoryImport(
  { id, title, template }: ParsedStory,
  resolvedScript?: SFCScriptBlock
) {
  const { code } = compileTemplate({
    source: template.trim(),
    filename: 'test.vue',
    id: 'test',
    compilerOptions: { bindingMetadata: resolvedScript?.bindings },
  })

  // Capitalize id to avoid collisions with standard js keywords (e.g. if the id is 'default')
  id = id.charAt(0).toUpperCase() + id.slice(1)

  const renderFunction = code.replace(
    'export function render',
    `function render${id}`
  )

  // Each named export is a story, has to return a Vue ComponentOptionsBase
  return `
    ${renderFunction}
    export const ${id} = () => Object.assign({render: render${id}}, _sfc_main)
    ${id}.storyName = '${title}'
    ${id}.parameters = {
      docs: { source: { code: \`${template.trim()}\` } },
    };`
}

function organizeImports(result: string): string {
  // Use prettier to organize imports
  return prettierFormat(result, {
    parser: 'babel',
    plugins: ['prettier-plugin-organize-imports'],
  })
}
