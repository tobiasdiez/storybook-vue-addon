// Button.stories.ts

import Button from '../components/Button.vue'

import type { Meta, StoryFn } from '@storybook/vue3'

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/vue/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'docs/4. How to write stories/classical',
  component: Button,
} as Meta<typeof Button>

export const Primary: StoryFn<typeof Button> = () => ({
  components: { Button },
  template: '<Button background="#ff0" label="Button" />',
})

export const Secondary: StoryFn<typeof Button> = () => ({
  components: { Button },
  template: '<Button background="#ff0" label="😄👍😍💯" />',
})

export const Tertiary: StoryFn<typeof Button> = () => ({
  components: { Button },
  template: '<Button background="#ff0" label="📚📕📈🤓" />',
})
