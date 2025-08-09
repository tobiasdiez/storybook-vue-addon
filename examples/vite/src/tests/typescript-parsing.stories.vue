<script lang="ts" setup>
import MyButton from '../components/Button.vue'

const label: string = 'Button'
</script>

<template>
  <Stories
    :component="MyButton"
    title="Tests/Typescript parsing"
  >
    <Story title="Default">
      <MyButton :label="label" />
    </Story>
  </Stories>
</template>
