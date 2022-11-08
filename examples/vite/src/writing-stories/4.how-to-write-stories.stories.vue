<script setup lang="ts">
import Button from '../components/Button.vue'
</script>
<template>
  <!--
    👇 The title prop is optional.
    See https://storybook.js.org/docs/vue/configure/overview#configure-story-loading
    to learn how to generate automatic titles
  -->
  <Stories title="docs/4. How to write stories/native">
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
