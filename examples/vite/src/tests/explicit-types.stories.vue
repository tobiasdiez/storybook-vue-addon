<script lang="ts" setup>
import MyButton from '../components/Button.vue'
import { Stories, Story } from 'storybook-vue-addon/types'
</script>

<template>
  <Stories
    :component="MyButton"
    title="Tests/Explicit types"
  >
    <Story title="test">
      <MyButton label="Button" />
    </Story>
  </Stories>
</template>
