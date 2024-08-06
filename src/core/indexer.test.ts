import { indexerCode } from './indexer'
import { describe, expect, it } from 'vitest'

describe('indexer', () => {
  const options = {
    makeTitle: (userTitle: string | undefined) => userTitle || 'UNDEFINED',
    fileName: 'file.vue',
  }
  it('handles one simple story', () => {
    const code =
      '<template><Stories title="Simple"><Story title="Primary">hello</Story></Stories></template>'
    const result = indexerCode(code, options)
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "exportName": "primary",
          "importPath": "file.vue",
          "name": "Primary",
          "tags": [],
          "title": "Simple",
          "type": "story",
        },
      ]
    `)
  })

  it('handles stories with complex names', () => {
    const code =
      '<template><Stories title="Simple"><Story title="바보 (babo) 2:3!">hello</Story</template>'
    const result = indexerCode(code, options)
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "exportName": "___babo_2_3",
          "importPath": "file.vue",
          "name": "바보 (babo) 2:3!",
          "tags": [],
          "title": "Simple",
          "type": "story",
        },
      ]
    `)
  })

  it('creates unique ids for stories with same title', () => {
    // TODO: This is currently not working as expected
    const code =
      '<template><Stories title="Simple"><Story title="Primary">hello</Story><Story title="Primary">hello two</Story></Stories></template>'
    const result = indexerCode(code, options)
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "exportName": "primary",
          "importPath": "file.vue",
          "name": "Primary",
          "tags": [],
          "title": "Simple",
          "type": "story",
        },
        {
          "exportName": "primary",
          "importPath": "file.vue",
          "name": "Primary",
          "tags": [],
          "title": "Simple",
          "type": "story",
        },
      ]
    `)
  })
})
