<script lang="ts" setup>
import MyButton from '../components/Button.vue'
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
