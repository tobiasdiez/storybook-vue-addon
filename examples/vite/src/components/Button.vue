<template>
  <button type="button" :class="classes" :style="style" @click="onClick">
    {{ label }}
  </button>
</template>

<script>
// oxlint-disable-next-line import/no-unassigned-import
import './button.css'
import { computed, reactive } from 'vue'

export default {
  emits: ['click'],

  name: 'MyButton',

  props: {
    backgroundColor: {
      type: String,
    },
    label: {
      required: true,
      type: String,
    },
    primary: {
      default: false,
      type: Boolean,
    },
    size: {
      type: String,
      validator(value) {
        return ['small', 'medium', 'large'].includes(value)
      },
    },
  },

  setup(props, { emit }) {
    props = reactive(props)
    return {
      classes: computed(() => ({
        'storybook-button': true,
        'storybook-button--primary': props.primary,
        'storybook-button--secondary': !props.primary,
        [`storybook-button--${props.size || 'medium'}`]: true,
      })),
      onClick() {
        emit('click')
      },
      style: computed(() => ({
        backgroundColor: props.backgroundColor,
      })),
    }
  },
}
</script>
