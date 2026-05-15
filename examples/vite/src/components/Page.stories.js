import { userEvent, within } from 'storybook/test'
import MyPage from './Page.vue'

export default {
  component: MyPage,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/vue/configure/story-layout
    layout: 'fullscreen',
  },
  title: 'Example/Page',
}

const Template = () => ({
  // Components used in your story `template` are defined in the `components` object
  components: { MyPage },

  // Here we define the `template`
  template: '<my-page />',
})

export const LoggedOut = Template.bind({})

// More on interaction testing: https://storybook.js.org/docs/vue/writing-tests/interaction-testing
export const LoggedIn = Template.bind({})
LoggedIn.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const loginButton = canvas.getByRole('button', { name: /log in/i })
  await userEvent.click(loginButton)
}
