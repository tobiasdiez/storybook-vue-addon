import { describe, expect, it } from 'vitest'
import { compileTemplate, parse } from 'vue/compiler-sfc'
import { transform } from '../src/core/transform'

describe('transform', () => {
  it('handles one simple story', () => {
    const code = '<template><Stories><Story title="Primary">hello</Story></Stories></template>'
    const result = transform(code)
    expect(result).toMatchInlineSnapshot(`
      "export default {
          
          //component: MyComponent,
          //decorators: [ ... ],
          //parameters: { ... }
          }
          
          
      function renderPrimary(_ctx, _cache) {
        return \\"hello\\"
      }
          export const Primary = renderPrimary"
    `)
  })
  it('extracts title from Stories', () => {
    const code = '<template><Stories title="test"><Story title="Primary">hello</Story></Stories></template>'
    const result = transform(code)
    expect(result).toMatchInlineSnapshot(`
      "export default {
          title: 'test',
          //component: MyComponent,
          //decorators: [ ... ],
          //parameters: { ... }
          }
          
          
      function renderPrimary(_ctx, _cache) {
        return \\"hello\\"
      }
          export const Primary = renderPrimary"
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
      "export default {
          
          //component: MyComponent,
          //decorators: [ ... ],
          //parameters: { ... }
          }
          
          
      function renderPrimary(_ctx, _cache) {
        return \\"hello\\"
      }
          export const Primary = renderPrimary
          
      function renderSecondary(_ctx, _cache) {
        return \\"world\\"
      }
          export const Secondary = renderSecondary"
    `)
  },
  )
})
