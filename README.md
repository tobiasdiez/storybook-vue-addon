# Storybook Vue Addon

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
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

This package is currently in an early alpha stage and supports only the fundamental Storybook features.
Compatibility with more advanced features and addons is work in progress.
Please open an issue if you encounter any bugs or missing integrations.

## Installation

> Note: Currently, only the [vite storybook builder](https://github.com/storybookjs/builder-vite) is supported and `@storybook/builder-vite` version 0.2.7 or higher is required.

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
- `dev`: Build in watch mode.
- `lint`: Check for eslint and prettier issues.
- `test`: Run the tests.
- `example:vite`: Open the example storybook (using vite).
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
