<script lang="ts" setup>
import MyButton from '../components/Button.vue'
import type { Stories, Story } from 'storybook-vue-addon/core'
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
