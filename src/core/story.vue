<!-- eslint-disable vue/multi-word-component-names -->
<!-- This file is only used to build types to ease development (build:types command), and it is not shipped -->
<script setup lang="ts" generic="TComponent = unknown">
import type { Meta, StoryObj } from '@storybook/vue3'

defineProps<{
  /**
   * Display name in the UI.
   */
  title: string
  /**
   * Function that is executed after the story is rendered.
   *
   * Must be defined in a non-setup script
   */
  play?: StoryObj<Meta<TComponent>>['play']
}>()
</script>

<template>
  <div></div>
</template>
