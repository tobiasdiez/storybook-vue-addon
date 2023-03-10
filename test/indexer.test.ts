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
            "id": "Primary",
            "name": "Primary",
          },
        ],
      }
    `)
  })
})
