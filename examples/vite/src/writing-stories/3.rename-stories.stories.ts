import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Button from '../components/Button.vue'

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'docs/3. Rename stories/classical',
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  // 👇 Rename this story
  name: 'I am the primary',
  args: {
    label: 'Button',
    primary: true,
  },
}
