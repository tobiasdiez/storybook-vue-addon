<script lang="ts" setup>
import MyButton from '../components/Button.vue'
import type { Story, Stories } from 'storybook-vue-addon/types'
</script>

<template>
  <Stories
    :component="MyButton"
    title="Tests/Explicit types"
  >
    <Story title="Default">
      <MyButton label="Button" />
    </Story>
  </Stories>
</template>
