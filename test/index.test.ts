import { describe, expect, it } from 'vitest'
import { transform } from '../src/core/transform'

describe('transform', () => {
  it('handles one simple story', () => {
    const code =
      '<template><Stories><Story title="Primary">hello</Story></Stories></template>'
    const result = transform(code)
    expect(result).toMatchInlineSnapshot(`
      "const _sfc_main = {};
      export default {
        //decorators: [ ... ],
        //parameters: { ... }
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
  it('extracts title from Stories', () => {
    const code =
      '<template><Stories title="test"><Story title="Primary">hello</Story></Stories></template>'
    const result = transform(code)
    expect(result).toMatchInlineSnapshot(`
      "const _sfc_main = {};
      export default {
        title: \\"test\\",

        //decorators: [ ... ],
        //parameters: { ... }
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
  it('throws error if story does not have a title', () => {
    const code = '<template><Stories><Story>hello</Story></Stories></template>'
    expect(() => transform(code)).toThrowErrorMatchingInlineSnapshot(
      '"Story is missing a title"'
    )
  })
  it('extracts component from Stories', () => {
    const code =
      '<script>const MyComponent = {}</script><template><Stories :component="MyComponent"><Story title="Primary">hello</Story></Stories></template>'
    const result = transform(code)
    expect(result).toMatchInlineSnapshot(`
      "const MyComponent = {};
      const _sfc_main = {};
      export default {
        component: MyComponent,
        //decorators: [ ... ],
        //parameters: { ... }
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
  it('handles title with spaces', () => {
    const code =
      '<template><Stories><Story title="Primary story">hello</Story></Stories></template>'
    const result = transform(code)
    expect(result).toMatchInlineSnapshot(`
      "const _sfc_main = {};
      export default {
        //decorators: [ ... ],
        //parameters: { ... }
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
  it('handles comment before stories tag', () => {
    const code =
      '<template><!-- comment --><Stories><Story title="Primary">hello</Story></Stories></template>'
    const result = transform(code)
    expect(result).toMatchInlineSnapshot(`
      "const _sfc_main = {};
      export default {
        //decorators: [ ... ],
        //parameters: { ... }
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
  it('handles multiple stories', () => {
    const code = `
      <template>
        <Stories>
          <Story title="Primary">hello</Story>
          <Story title="Secondary">world</Story>
        </Stories>
      </template>`
    const result = transform(code)
    expect(result).toMatchInlineSnapshot(`
      "const _sfc_main = {};
      export default {
        //decorators: [ ... ],
        //parameters: { ... }
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
  it('combines helper imports for multiple stories', () => {
    const code = `
      <template>
        <Stories>
          <Story title="Primary"><Button></Story>
          <Story title="Secondary"><Button></Story>
        </Stories>
      </template>`
    const result = transform(code)
    expect(result).toMatchInlineSnapshot(`
      "const _sfc_main = {};
      export default {
        //decorators: [ ... ],
        //parameters: { ... }
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
  it('supports components defined in script setup', () => {
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
    const result = transform(code)
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
        //parameters: { ... }
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
})
