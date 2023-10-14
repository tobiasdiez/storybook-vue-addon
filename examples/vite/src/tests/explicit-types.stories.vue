<script lang="ts" setup>
import MyButton from '../components/Button.vue'
import type { Story, Stories } from '../../../../src/types'
</script>

<template>
  <Stories
    :component="MyButton"
    title="Tests/Default Name"
  >
    <Story title="Default">
      <MyButton label="Button" />
    </Story>
  </Stories>
</template>
