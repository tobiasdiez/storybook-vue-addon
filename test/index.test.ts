import { describe, expect, it } from 'vitest'
import { transform } from '../src/core/transform'

describe('transform', () => {
  it('handles one simple story', () => {
    const code = '<template><Stories><Story title="Primary">hello</Story></Stories></template>'
    const result = transform(code)
    expect(result).toMatchInlineSnapshot(`
      "const _sfc_main = {}
      export default {
          
          //component: MyComponent,
          //decorators: [ ... ],
          //parameters: { ... }
          }
          
          
      function renderPrimary(_ctx, _cache) {
        return \\"hello\\"
      }
          export const Primary = () => Object.assign({render: renderPrimary}, _sfc_main)"
    `)
  })
  it('extracts title from Stories', () => {
    const code = '<template><Stories title="test"><Story title="Primary">hello</Story></Stories></template>'
    const result = transform(code)
    expect(result).toMatchInlineSnapshot(`
      "const _sfc_main = {}
      export default {
          title: 'test',
          //component: MyComponent,
          //decorators: [ ... ],
          //parameters: { ... }
          }
          
          
      function renderPrimary(_ctx, _cache) {
        return \\"hello\\"
      }
          export const Primary = () => Object.assign({render: renderPrimary}, _sfc_main)"
    `)
  })
  it('throws error if story does not have a title', () => {
    const code = '<template><Stories><Story>hello</Story></Stories></template>'
    expect(() => transform(code)).toThrowErrorMatchingInlineSnapshot('"Story is missing a title"')
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
      "const _sfc_main = {}
      export default {
          
          //component: MyComponent,
          //decorators: [ ... ],
          //parameters: { ... }
          }
          
          
      function renderPrimary(_ctx, _cache) {
        return \\"hello\\"
      }
          export const Primary = () => Object.assign({render: renderPrimary}, _sfc_main)
          
      function renderSecondary(_ctx, _cache) {
        return \\"world\\"
      }
          export const Secondary = () => Object.assign({render: renderSecondary}, _sfc_main)"
    `)
  },
  )
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
                return { a: 123 }
              },
              template: '<span>{{a}}</span>'
            }
            
      const __returned__ = { test }
      Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })
      return __returned__
      }

      }
      export default {
          
          //component: MyComponent,
          //decorators: [ ... ],
          //parameters: { ... }
          }
          
          import { openBlock as _openBlock, createBlock as _createBlock } from \\"vue\\"

      function renderPrimary(_ctx, _cache, $props, $setup, $data, $options) {
        return (_openBlock(), _createBlock($setup[\\"test\\"]))
      }
          export const Primary = () => Object.assign({render: renderPrimary}, _sfc_main)"
    `)
  })
})
