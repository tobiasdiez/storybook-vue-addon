<template>
  <div class="container">
    <form @submit.prevent="handleSubmit">
      <label for="email">Email</label>
      <input
        v-model="email"
        id="email"
        type="text"
        data-testid="email"
      />
      <label for="password">Password</label>
      <input
        v-model="password"
        id="password"
        type="password"
        data-testid="password"
      />
      <Button
        label="Submit"
        type="submit"
        primary
      ></Button>
    </form>

    <p>
      {{ message }}
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Button from './Button.vue'

const message = ref('')
const email = ref('')
const password = ref('')

function handleSubmit() {
  if (!email.value) {
    message.value = 'Please enter your email'
    return
  }
  if (!password.value) {
    message.value = 'Please enter your password'
    return
  }
  message.value =
    'Everything is perfect. Your account is ready and we should probably get you started!'
}
</script>

<style scoped>
form > input {
  margin: 7px;
}
.container,
form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
