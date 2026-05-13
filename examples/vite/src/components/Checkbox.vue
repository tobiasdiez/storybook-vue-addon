<template>
  <div class="checkbox">
    <input type="checkbox" :checked="checked" :disabled="disabled" @change="onChange" />
    <label>{{ label }}</label>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  checked: {
    default: false,
    required: false,
    type: Boolean,
  },
  disabled: {
    default: false,
    required: false,
    type: Boolean,
  },
  label: {
    required: true,
    type: String,
  },
})

const checked = ref(props.checked)

const onChange = () => {
  checked.value = !checked.value
}
</script>
