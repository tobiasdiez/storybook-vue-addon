import { indexerCode } from '../src/core/indexer'
import { describe, expect, it } from 'vitest'

describe('indexer', () => {
  const options = {
    makeTitle: (userTitle: string | undefined) => userTitle || 'UNDEFINED',
  }
  it('handles one simple story', () => {
    const code =
      '<template><Stories title="Simple"><Story title="Primary">hello</Story></Stories></template>'
    const result = indexerCode(code, options)
    expect(result).toMatchInlineSnapshot(`
      {
        "meta": {
          "title": "Simple",
        },
        "stories": [
          {
            "id": "simple--primary",
            "name": "Primary",
          },
        ],
      }
    `)
  })

  it('handles stories with complex names', () => {
    const code =
      '<template><Stories title="Simple"><Story title="바보 (babo) 2:3!">hello</Story</template>'
    const result = indexerCode(code, options)
    expect(result).toMatchInlineSnapshot(`
      {
        "meta": {
          "title": "Simple",
        },
        "stories": [
          {
            "id": "simple--babo-2-3",
            "name": "바보 (babo) 2:3!",
          },
        ],
      }
    `)
  })

  it('creates unique ids for stories with same title', () => {
    const code =
      '<template><Stories title="Simple"><Story title="Primary">hello</Story><Story title="Primary">hello two</Story></Stories></template>'
    const result = indexerCode(code, options)
    expect(result).toMatchInlineSnapshot(`
      {
        "meta": {
          "title": "Simple",
        },
        "stories": [
          {
            "id": "simple--primary",
            "name": "Primary",
          },
          {
            "id": "simple--primary",
            "name": "Primary",
          },
        ],
      }
    `)
  })
})
