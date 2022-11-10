<script lang="ts" setup>
import MyButton from './Button.vue'
</script>

<template>
  <Stories :component="MyButton">
    <Story title="Primary">
      <MyButton label="Button" />
    </Story>
  </Stories>
</template>
