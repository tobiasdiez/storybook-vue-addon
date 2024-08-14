<script setup lang="ts">
import Button from '../components/Button.vue'
</script>
<template>
  <Stories
    title="docs/4. How to write stories/native"
    :component="Button"
  >
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
