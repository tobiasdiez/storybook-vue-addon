<script setup lang="ts">
import Button from '../components/Button.vue'
</script>
<template>
  <Stories
    title="docs/3. Rename stories/native"
    :component="Button"
  >
    <!--
      👇 Instead of using named exports as in a CSF file,
      a story is defined using the <Story> component.
      The name of the story is specified via the `title` prop.
    -->
    <Story title="I am the primary">
      <Button
        primary
        label="Button"
      />
    </Story>
  </Stories>
</template>
