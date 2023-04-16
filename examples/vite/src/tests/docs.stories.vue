<script lang="ts" setup>
import MyButton from '../components/Button.vue'
</script>

<template>
  <Stories
    :component="MyButton"
    title="Tests/Docs"
  >
    <Story title="Default">
      <MyButton label="Button" />
    </Story>
  </Stories>
</template>

<docs lang="md">
import { Canvas } from '@storybook/blocks';

# Documentation

Everything in one place. Isn't it great?

You can render stories in the docs using the `<Canvas>` component.

<Canvas />

See [Storybook Docs](https://storybook.js.org/docs/vue/writing-docs/introduction) for more information.
</docs>
