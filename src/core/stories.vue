<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts" generic="TComponent = unknown">
defineProps<{
  /**
   * Title of the component which will be presented in the navigation. **Should be unique.**
   *
   * Components can be organized in a nested structure using "/" as a separator.
   *
   * @see [Naming components and hierarchy](https://storybook.js.org/docs/vue/writing-stories/naming-components-and-hierarchy)
   */
  title?: string
  /**
   * The primary component for your story.
   *
   * Used by addons for automatic prop table generation and display of other component metadata.
   */
  component?: TComponent
}>()
</script>

<template>
  <div></div>
</template>
