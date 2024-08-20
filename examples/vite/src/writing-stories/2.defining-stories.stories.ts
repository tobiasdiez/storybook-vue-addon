import type { Meta, StoryObj } from '@storybook/vue3'

import Button from '../components/Button.vue'

const meta: Meta<typeof Button> = {
  title: 'docs/2. Defining stories/classical',
  component: Button,
}

export default meta
type Story = StoryObj<typeof Button>

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: (args) => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: '<Button v-bind="args" />',
  }),
  args: {
    primary: true,
    label: 'Button',
  },
}
