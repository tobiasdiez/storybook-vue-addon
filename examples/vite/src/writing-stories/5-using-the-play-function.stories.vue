<script setup>
import { userEvent, within } from '@storybook/testing-library'
import { expect } from '@storybook/jest'
import LoginForm from '../components/LoginForm.vue'
</script>

<script>
/*
 * See https://storybook.js.org/docs/vue/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
async function playFunction({ canvasElement }) {
  const canvas = within(canvasElement)

  // 👇 Simulate interactions with the component
  await userEvent.type(canvas.getByTestId('email'), 'email@provider.com')

  await userEvent.type(canvas.getByTestId('password'), 'a-random-password')

  // See https://storybook.js.org/docs/vue/essentials/actions#automatically-matching-args to learn how to setup logging in the Actions panel
  await userEvent.click(canvas.getByRole('button'))

  // 👇 Assert DOM structure
  await expect(
    canvas.getByText(
      'Everything is perfect. Your account is ready and we should probably get you started!',
    ),
  ).toBeInTheDocument()
}
</script>

<template>
  <Stories
    title="docs/5. Using the play function/native"
    :component="LoginForm"
  >
    <Story title="Empty Form">
      <LoginForm />
    </Story>
    <Story
      title="Filled Form"
      :play="playFunction"
    >
      <LoginForm />
    </Story>
  </Stories>
</template>
