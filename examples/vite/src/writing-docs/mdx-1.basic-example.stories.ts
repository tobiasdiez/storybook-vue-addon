// Checkbox.stories.ts|tsx

// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Checkbox from '../components/Checkbox.vue'

const meta: Meta<typeof Checkbox> = {
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
