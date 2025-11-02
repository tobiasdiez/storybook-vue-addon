# Storybook Vue Addon

[![NPM version][npm-version-src]][npm-version-href]
[![NPM downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions][github-actions-src]][github-actions-href]
[![Codecov][codecov-src]][codecov-href]

A Storybook addon that allows to write stories in native Vue syntax and compiles it to Storybook's CSF format.

Example: `Button.stories.vue`

```vue
<script setup lang="ts">
import Button from './Button.vue'
</script>
<template>
  <Stories
    title="Stories in Vue format 😍"
    :component="Button"
  >
    <Story title="Primary">
      <Button
        background="#ff0"
        label="Button"
      />
    </Story>
    <Story title="Secondary">
      <Button
        background="#ff0"
        label="😄👍😍💯"
      />
    </Story>
    <Story title="Tertiary">
      <Button
        background="#ff0"
        label="📚📕📈🤓"
      />
    </Story>
  </Stories>
</template>
```

## Features

- Write stories as idiomatic Vue templates, bye bye string-based templates, as wished for in [storybookjs/storybook#9768](https://github.com/storybookjs/storybook/issues/9768)
- Syntax highlighting and full editor support (including Volar) for writing story templates
- Add markdown documentation in a custom `docs` block, directly in your `stories.vue` files (see below for details)
- The component that is displayed needs only be declared once (via `<Stories :component="...">`) and not for every story
- Simple integration with Storybook and automatic Vite support
- Light: Vue stories are transpiled into ordinary CSF stories on the fly with minimal overhead

This package is currently in an early alpha stage and supports only the fundamental Storybook features.
Compatibility with more advanced features and addons is work in progress.
Please open an issue if you encounter any bugs or missing integrations.

The way to write stories as idiomatic Vue templates is heavily inspired by the great [Histoire](https://histoire.dev/).

## Installation

> Note: Currently, only the [`@storybook/vue3-vite`](https://github.com/storybookjs/storybook/tree/next/code/frameworks/vue3-vite) builder is supported.

1. Add `storybook-vue-addon` to your dev-dependencies.

   ```sh
   # npm
   npm install --save-dev storybook-vue-addon

   # yarn
   yarn add -D storybook-vue-addon

   # pnpm
   pnpm add -D storybook-vue-addon
   ```

2. In `.storybook/main.js`, add `*.stories.vue` to the stories patterns and `storybook-vue-addon` as an addon.

   ```diff
     "stories": [
       "../src/**/*.stories.mdx",
   -    "../src/**/*.stories.@(js|jsx|ts|tsx)"
   +    "../src/**/*.stories.@(js|jsx|ts|tsx|vue)"
     ],
     ...
     "addons": [
       "@storybook/addon-essentials",
   +   "storybook-vue-addon"
     ],

   ```

## Adding documentation

You can add documentation for your components directly in your story SFC using the custom `docs` block.

```vue
<template>Define your stories here as above</template>

<docs lang="md">
import { Canvas } from '@storybook/blocks';

# Documentation

Everything in one place. Isn't it great?

You can render stories in the docs using the `<Canvas>` component.

<Canvas />
</docs>
```

You can use Markdown’s readable syntax (such as # heading) for your documentation, include stories, and freely embed JSX component blocks at any point in the file. See [Storybook Docs](https://storybook.js.org/docs/vue/writing-docs/introduction) for more information.
There are a few minor differences to standard MDX documentation pages:

- The `<Meta of=...>` tag is not needed.
- You don't need to import the stories file. Simply refer to the defined stories by their name. For example:
  ```vue
  <template>
    <Stories>
      <Story title="Unchecked">
        <Checkbox label="Unchecked" />
      </Story>
    </Stories>
  </template>
  <docs>
    import { Canvas } from '@storybook/blocks';
    <Canvas of={Unchecked} />
  </docs>
  ```

## Typescript support

Volar should be able to automatically recognize the `Stories` and `Story` components. It is also possible to import them from `storybook-vue-addon`:

```ts
import type { Stories, Story } from 'storybook-vue-addon/core'
```

## Manual usage

If for whatever reason you process Storybook stories in your build pipeline, you probably want to first transpile the Vue stories to classical CSF stories by adding `storybook-vue-addon` to your build.

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import VueStories from 'storybook-vue-addon/vite'

export default defineConfig({
  plugins: [
    VueStories({
      /* options */
    }),
  ],
})
```

Example: [`playground/`](./playground/)

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import VueStories from 'storybook-vue-addon/rollup'

export default {
  plugins: [
    VueStories({
      /* options */
    }),
  ],
}
```

<br></details>

<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require('storybook-vue-addon/webpack')({
      /* options */
    }),
  ],
}
```

<br></details>

<details>
<summary>Nuxt</summary><br>

```ts
// nuxt.config.js
export default {
  buildModules: [
    [
      'storybook-vue-addon/nuxt',
      {
        /* options */
      },
    ],
  ],
}
```

> This module works for both Nuxt 2 and [Nuxt Vite](https://github.com/nuxt/vite)

<br></details>

<details>
<summary>Vue CLI</summary><br>

```ts
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      require('storybook-vue-addon/webpack')({
        /* options */
      }),
    ],
  },
}
```

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
// esbuild.config.js
import { build } from 'esbuild'
import VueStories from 'storybook-vue-addon/esbuild'

build({
  plugins: [VueStories()],
})
```

<br></details>

## 💻 Development

- Clone this repository
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable` (use `npm i -g corepack` for Node.js < 16.10).
- Install dependencies using `pnpm install`.

Commands:

- `build`: Build everything. Output can be found in `dist`.
- `build:types`: Build the types for the `Story` and `Stories` components, to ease development in the `components.d.ts` file.
- `dev`: Build in watch mode.
- `lint`: Check for eslint and prettier issues.
- `test`: Run the tests.
- `example:vite`: Open the example storybook (using vite). You need to run `build` or `dev` first.
- `play`: Run the playground (currently not used).
- `release`: Release a new version to npm.

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/storybook-vue-addon?style=flat-square
[npm-version-href]: https://www.npmjs.com/package/storybook-vue-addon
[npm-downloads-src]: https://img.shields.io/npm/dm/storybook-vue-addon?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/storybook-vue-addon
[github-actions-src]: https://img.shields.io/github/actions/workflow/status/tobiasdiez/storybook-vue-addon/ci.yml?branch=main&style=flat-square
[github-actions-href]: https://github.com/tobiasdiez/storybook-vue-addon/actions?query=workflow%3Aci
[codecov-src]: https://img.shields.io/codecov/c/gh/tobiasdiez/storybook-vue-addon/main?style=flat-square
[codecov-href]: https://codecov.io/gh/tobiasdiez/storybook-vue-addon

## Sponsors

<a href="https://www.chromatic.com/"><img src="https://user-images.githubusercontent.com/321738/84662277-e3db4f80-af1b-11ea-88f5-91d67a5e59f6.png" width="153" height="30" alt="Chromatic" /></a>

Thanks to [Chromatic](https://www.chromatic.com/) for providing the visual testing platform that helps us review UI changes and catch visual regressions.
