// Checkbox.stories.ts|tsx

// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/vue3'

import Checkbox from '../components/Checkbox.vue'

const meta: Meta<typeof Checkbox> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'docs/Writing docs/MDX/1. Basic Example/classical',
  component: Checkbox,
}

export default meta
type Story = StoryObj<typeof Checkbox>

export const Unchecked: Story = {
  args: {
    label: 'Unchecked',
  },
}
