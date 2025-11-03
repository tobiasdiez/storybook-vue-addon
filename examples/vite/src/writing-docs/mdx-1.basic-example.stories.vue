<script setup lang="ts">
import Checkbox from '../components/Checkbox.vue'
</script>
<template>
  <Stories
    :component="Checkbox"
    title="docs/Writing docs/MDX/1. Basic Example/native"
  >
    <Story title="Unchecked">
      <Checkbox label="Unchecked" />
    </Story>
  </Stories>
</template>
<docs lang="md">
import { Canvas } from '@storybook/addon-docs/blocks';

# Checkbox

A checkbox is a square box that can be activated or deactivated when ticked.

Use checkboxes to select one or more options from a list of choices.

<Canvas of={Unchecked} />
</docs>
