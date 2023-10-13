import type { ParserPlugin } from '@babel/parser'
import { compile as compileMdx } from '@storybook/mdx2-csf'
import { format as prettierFormat } from 'prettier'
import type { SFCScriptBlock } from 'vue/compiler-sfc'
import { compileTemplate, rewriteDefault } from 'vue/compiler-sfc'
import { ParsedMeta, ParsedStory, parse } from './parser'

/**
 * Transforms a vue single-file-component into Storybook's Component Story Format (CSF).
 */
export async function transform(code: string) {
  let result = ''
  const { resolvedScript, meta, stories, docs } = parse(code)
  const isTS = resolvedScript?.lang === 'ts'
  if (resolvedScript) {
    const babelPlugins: ParserPlugin[] = isTS ? ['typescript'] : []
    result += rewriteDefault(resolvedScript.content, '_sfc_main', babelPlugins)
    result += '\n'
  } else {
    result += 'const _sfc_main = {}\n'
  }
  result += await transformTemplate({ meta, stories, docs }, resolvedScript)
  result = await organizeImports(result, isTS)
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

async function transformTemplate(
  {
    meta,
    stories,
    docs,
  }: { meta: ParsedMeta; stories: ParsedStory[]; docs?: string },
  resolvedScript?: SFCScriptBlock,
) {
  let result = generateDefaultImport(meta, docs)
  for (const story of stories) {
    result += generateStoryImport(story, resolvedScript)
  }
  if (docs) {
    let mdx = await compileMdx(docs, { skipCsf: true })
    mdx = mdx.replace('export default MDXContent;', '')
    result += mdx
  }
  return result
}

function generateDefaultImport(
  { title, component }: ParsedMeta,
  docs?: string,
) {
  return `export default {
    ${title ? `title: '${title}',` : ''}
    ${component ? `component: ${component},` : ''}
    //decorators: [ ... ],
    parameters: {
      ${docs ? `docs: { page: MDXContent },` : ''}
    }
  }
  `
}

function generateStoryImport(
  { id, title, play, template }: ParsedStory,
  resolvedScript?: SFCScriptBlock,
) {
  const { code } = compileTemplate({
    source: template.trim(),
    filename: 'test.vue',
    id: 'test',
    compilerOptions: {
      bindingMetadata: resolvedScript?.bindings,
      // prevent the hoisting of static variables since that would
      // result in clashing variable names when the same HTML Tags are used in multiple stories within the same `*.stories.vue` file.
      hoistStatic: false,
    },
  })

  // Capitalize id to avoid collisions with standard js keywords (e.g. if the id is 'default')
  id = id.charAt(0).toUpperCase() + id.slice(1)

  const renderFunction = code.replace(
    'export function render',
    `function render${id}`,
  )

  // Each named export is a story, has to return a Vue ComponentOptionsBase
  return `
    ${renderFunction}
    export const ${id} = () => Object.assign({render: render${id}}, _sfc_main)
    ${id}.storyName = '${title}'
    ${play ? `${id}.play = ${play}` : ''}
    ${id}.parameters = {
      docs: { source: { code: \`${template.trim()}\` } },
    };`
}

async function organizeImports(result: string, isTS: boolean): Promise<string> {
  // Use prettier to organize imports
  return await prettierFormat(result, {
    parser: isTS ? 'typescript' : 'babel',
    plugins: ['prettier-plugin-organize-imports'],
  })
}
