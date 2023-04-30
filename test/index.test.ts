import { describe, expect, it } from 'vitest'
import { transform } from '../src/core/transform'

describe('transform', () => {
  it('handles one simple story', async () => {
    const code =
      '<template><Stories><Story title="Primary">hello</Story></Stories></template>'
    const result = await transform(code)
    expect(result).toMatchInlineSnapshot(`
      "const _sfc_main = {};
      export default {
        //decorators: [ ... ],
        parameters: {},
      };

      function renderPrimary(_ctx, _cache) {
        return \\"hello\\";
      }
      export const Primary = () =>
        Object.assign({ render: renderPrimary }, _sfc_main);
      Primary.storyName = \\"Primary\\";

      Primary.parameters = {
        docs: { source: { code: \`hello\` } },
      };
      "
    `)
  })
  it('extracts title from Stories', async () => {
    const code =
      '<template><Stories title="test"><Story title="Primary">hello</Story></Stories></template>'
    const result = await transform(code)
    expect(result).toMatchInlineSnapshot(`
      "const _sfc_main = {};
      export default {
        title: \\"test\\",

        //decorators: [ ... ],
        parameters: {},
      };

      function renderPrimary(_ctx, _cache) {
        return \\"hello\\";
      }
      export const Primary = () =>
        Object.assign({ render: renderPrimary }, _sfc_main);
      Primary.storyName = \\"Primary\\";

      Primary.parameters = {
        docs: { source: { code: \`hello\` } },
      };
      "
    `)
  })
  it('throws error if story does not have a title', async () => {
    const code = '<template><Stories><Story>hello</Story></Stories></template>'
    await expect(() =>
      transform(code)
    ).rejects.toThrowErrorMatchingInlineSnapshot('"Story is missing a title"')
  })
  it('extracts component from Stories', async () => {
    const code =
      '<script>const MyComponent = {}</script><template><Stories :component="MyComponent"><Story title="Primary">hello</Story></Stories></template>'
    const result = await transform(code)
    expect(result).toMatchInlineSnapshot(`
      "const MyComponent = {};
      const _sfc_main = {};
      export default {
        component: MyComponent,
        //decorators: [ ... ],
        parameters: {},
      };

      function renderPrimary(_ctx, _cache, $props, $setup, $data, $options) {
        return \\"hello\\";
      }
      export const Primary = () =>
        Object.assign({ render: renderPrimary }, _sfc_main);
      Primary.storyName = \\"Primary\\";

      Primary.parameters = {
        docs: { source: { code: \`hello\` } },
      };
      "
    `)
  })
  it('handles title with spaces', async () => {
    const code =
      '<template><Stories><Story title="Primary story">hello</Story></Stories></template>'
    const result = await transform(code)
    expect(result).toMatchInlineSnapshot(`
      "const _sfc_main = {};
      export default {
        //decorators: [ ... ],
        parameters: {},
      };

      function renderPrimary_story(_ctx, _cache) {
        return \\"hello\\";
      }
      export const Primary_story = () =>
        Object.assign({ render: renderPrimary_story }, _sfc_main);
      Primary_story.storyName = \\"Primary story\\";

      Primary_story.parameters = {
        docs: { source: { code: \`hello\` } },
      };
      "
    `)
  })
  it('handles comment before stories tag', async () => {
    const code =
      '<template><!-- comment --><Stories><Story title="Primary">hello</Story></Stories></template>'
    const result = await transform(code)
    expect(result).toMatchInlineSnapshot(`
      "const _sfc_main = {};
      export default {
        //decorators: [ ... ],
        parameters: {},
      };

      function renderPrimary(_ctx, _cache) {
        return \\"hello\\";
      }
      export const Primary = () =>
        Object.assign({ render: renderPrimary }, _sfc_main);
      Primary.storyName = \\"Primary\\";

      Primary.parameters = {
        docs: { source: { code: \`hello\` } },
      };
      "
    `)
  })
  it('handles multiple stories', async () => {
    const code = `
      <template>
        <Stories>
          <Story title="Primary">hello</Story>
          <Story title="Secondary">world</Story>
        </Stories>
      </template>`
    const result = await transform(code)
    expect(result).toMatchInlineSnapshot(`
      "const _sfc_main = {};
      export default {
        //decorators: [ ... ],
        parameters: {},
      };

      function renderPrimary(_ctx, _cache) {
        return \\"hello\\";
      }
      export const Primary = () =>
        Object.assign({ render: renderPrimary }, _sfc_main);
      Primary.storyName = \\"Primary\\";

      Primary.parameters = {
        docs: { source: { code: \`hello\` } },
      };

      function renderSecondary(_ctx, _cache) {
        return \\"world\\";
      }
      export const Secondary = () =>
        Object.assign({ render: renderSecondary }, _sfc_main);
      Secondary.storyName = \\"Secondary\\";

      Secondary.parameters = {
        docs: { source: { code: \`world\` } },
      };
      "
    `)
  })
  it('combines helper imports for multiple stories', async () => {
    const code = `
      <template>
        <Stories>
          <Story title="Primary"><Button></Story>
          <Story title="Secondary"><Button></Story>
        </Stories>
      </template>`
    const result = await transform(code)
    expect(result).toMatchInlineSnapshot(`
      "const _sfc_main = {};
      export default {
        //decorators: [ ... ],
        parameters: {},
      };

      import {
        createBlock as _createBlock,
        openBlock as _openBlock,
        resolveComponent as _resolveComponent,
      } from \\"vue\\";

      function renderPrimary(_ctx, _cache) {
        const _component_Button = _resolveComponent(\\"Button\\");

        return _openBlock(), _createBlock(_component_Button);
      }
      export const Primary = () =>
        Object.assign({ render: renderPrimary }, _sfc_main);
      Primary.storyName = \\"Primary\\";

      Primary.parameters = {
        docs: { source: { code: \`<Button>\` } },
      };

      function renderSecondary(_ctx, _cache) {
        const _component_Button = _resolveComponent(\\"Button\\");

        return _openBlock(), _createBlock(_component_Button);
      }
      export const Secondary = () =>
        Object.assign({ render: renderSecondary }, _sfc_main);
      Secondary.storyName = \\"Secondary\\";

      Secondary.parameters = {
        docs: { source: { code: \`<Button>\` } },
      };
      "
    `)
  })
  it('supports components defined in script setup', async () => {
    const code = `
      <script setup>
      const test = {
        data() {
          return { a: 123 }
        },
        template: '<span>{{a}}</span>'
      }
      </script>
      <template>
        <Stories>
          <Story title="Primary"><test></test></Story>
        </Stories>
      </template>`
    const result = await transform(code)
    expect(result).toMatchInlineSnapshot(`
      "const _sfc_main = {
        setup(__props, { expose }) {
          expose();

          const test = {
            data() {
              return { a: 123 };
            },
            template: \\"<span>{{a}}</span>\\",
          };

          const __returned__ = { test };
          Object.defineProperty(__returned__, \\"__isScriptSetup\\", {
            enumerable: false,
            value: true,
          });
          return __returned__;
        },
      };
      export default {
        //decorators: [ ... ],
        parameters: {},
      };

      import { createBlock as _createBlock, openBlock as _openBlock } from \\"vue\\";

      function renderPrimary(_ctx, _cache, $props, $setup, $data, $options) {
        return _openBlock(), _createBlock($setup[\\"test\\"]);
      }
      export const Primary = () =>
        Object.assign({ render: renderPrimary }, _sfc_main);
      Primary.storyName = \\"Primary\\";

      Primary.parameters = {
        docs: { source: { code: \`<test></test>\` } },
      };
      "
    `)
  })
  it('supports docs blocks', async () => {
    const code = `
      <template>
        <Stories>
          <Story title="Primary">
            hello
          </Story>
        </Stories>
      </template>
      <docs>
        # Hello
        This is a story
      </docs>
      `
    const result = await transform(code)
    expect(result).toMatchInlineSnapshot(`
      "const _sfc_main = {};
      export default {
        //decorators: [ ... ],
        parameters: {
          docs: { page: MDXContent },
        },
      };

      function renderPrimary(_ctx, _cache) {
        return \\"hello\\";
      }
      export const Primary = () =>
        Object.assign({ render: renderPrimary }, _sfc_main);
      Primary.storyName = \\"Primary\\";

      Primary.parameters = {
        docs: { source: { code: \`hello\` } },
      }; /*@jsxRuntime automatic @jsxImportSource react*/
      import { useMDXComponents as _provideComponents } from \\"@mdx-js/react\\";
      import {
        Fragment as _Fragment,
        jsx as _jsx,
        jsxs as _jsxs,
      } from \\"react/jsx-runtime\\";
      function MDXContent(props = {}) {
        const { wrapper: MDXLayout } = Object.assign(
          {},
          _provideComponents(),
          props.components
        );
        return MDXLayout
          ? _jsx(
              MDXLayout,
              Object.assign({}, props, {
                children: _jsx(_createMdxContent, {}),
              })
            )
          : _createMdxContent();
        function _createMdxContent() {
          const _components = Object.assign(
            {
              h1: \\"h1\\",
              p: \\"p\\",
            },
            _provideComponents(),
            props.components
          );
          return _jsxs(_Fragment, {
            children: [
              _jsx(_components.h1, {
                children: \\"Hello\\",
              }),
              \\"\\\\n\\",
              _jsx(_components.p, {
                children: \\"This is a story\\",
              }),
            ],
          });
        }
      }
      "
    `)
  })

  it('supports play functions', async () => {
    const code = `
      <template>
        <Stories>
          <Story title="Primary" :play="playFunction">
          hello
          </Story>
        </Stories>
      </template>

      <script lang="ts">
      function playFunction({canvasElement}: any) {
        console.log("playFunction")
      }
      </script>
      `
    const result = await transform(code)
    expect(result).toMatchInlineSnapshot(`
    "function playFunction({ canvasElement }: any) {
      console.log(\\"playFunction\\");
    }
    
    const _sfc_main = {};
    export default {
      //decorators: [ ... ],
      parameters: {},
    };
    
    function renderPrimary(_ctx, _cache, $props, $setup, $data, $options) {
      return \\"hello\\";
    }
    export const Primary = () =>
      Object.assign({ render: renderPrimary }, _sfc_main);
    Primary.storyName = \\"Primary\\";
    Primary.play = playFunction;
    Primary.parameters = {
      docs: { source: { code: \`hello\` } },
    };
    "
    `)
  })
})
