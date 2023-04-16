<template>
  <div class="checkbox">
    <input
      type="checkbox"
      :checked="checked"
      :disabled="disabled"
      @change="onChange"
    />
    <label>{{ label }}</label>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  checked: {
    type: Boolean,
    required: false,
    default: false,
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const checked = ref(props.checked)

const onChange = () => {
  checked.value = !checked.value
}
</script>
