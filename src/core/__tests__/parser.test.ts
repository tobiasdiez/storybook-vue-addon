import { describe, expect, it } from 'vitest'
import { compileScript, parse as parseSFC } from 'vue/compiler-sfc'
import { extractDefineArgs, parse } from '../parser'

describe('extractDefineArgs', () => {
  // Question: `defineArgs` is a fake "macro" we created. Could we actually
  // implement it as a macro, so that it supports generics to allow
  // for `defineArgs<typeof Button>() and then infer the type of the args
  // with autocomplete for props and slots?
  it('should extract args', () => {
    const { descriptor } = parseSFC(`
    <script setup>
      defineArgs({foo: 'bar'})
    </script>
    <template>
      <h1>Test</h1>
    </template>
  `)

    const resolved = compileScript(descriptor, { id: 'test' })

    expect(extractDefineArgs(resolved)).toMatchObject({
      args: {
        foo: 'bar',
      },
    })
  })


})

describe('parse', () => {
  it('should parse the args', () => {
    const { args } = parse(`
    <script setup>
      defineArgs({foo: 'bar'})
    </script>
    <template>
     <Stories>
      <Story id="test" title="test" template="<h1>test</h1>"></Story>
     </Stories>
    </template>
  `)
    expect(args).toMatchObject({
      args: {
        foo: 'bar',
      },
    })
  })

    it("should expose the args to the template", () => {
    const { args } = parse(`
    <script setup>
      const args = defineArgs({default: 'hello world'})
    </script>
    <template>
     <Stories>
      <Story id="test" title="test">
        <b-button>{{ args.default }}</b-button>
      </Story>
     </Stories>
    </template>
  `)
    expect(args.default).toBe('hello world')
    })

  it("should parse the args from the template and allow for local story overrides", () => {
    const { stories } = parse(`
    <script setup>
      const args = defineArgs({default: 'hello world'})
    </script>
    <template>
     <Stories>
      <Story id="test" title="test" :args="{default: 'foo bar'}">
        <button>{{ args.default }}</button>
      </Story>
     </Stories>
    </template>
  `)

    // expect the args to be overwritten
    // TODO: test that the template is compiled to <button>foo bar</button>
    // right now it is <button>{{ args.default }}</button>
    // is it correct? at which stage should `args` be compiled into their actual values?
    expect(stories[0].template).toContain('foo bar')
  })
})


