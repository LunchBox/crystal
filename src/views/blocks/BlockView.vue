<script setup>
import { computed } from 'vue'
import { INPUT_TYPES } from '@/models/block_output.js'

const props = defineProps(['block'])

defineEmits(['edit', 'dragging'])

const bStyle = computed(() => {
  const [x = 0, y = 0] = props.block.position
  return {
    left: `${x}px`,
    top: `${y}px`
  }
})
</script>

<template>
  <div class="block" :style="bStyle">
    <div
      class="block-title"
      @dblclick.prevent="$emit('edit', block)"
      @mousedown.prevent="$emit('dragging', block)"
    >
      {{ block.title }}
    </div>
    <div class="block-content">
      <div class="block-inputs">
        <div class="block-input" v-for="arg in block.args" :key="arg">
          <span class="indicator input"></span>
          <span>{{ arg }}</span>
        </div>
      </div>
      <div class="block-outputs">
        <div class="block-output" v-for="output in block.outputs" :key="output">
          <span>{{ output.label }}</span>

          <input v-if="output.type === 'string'" type="text" v-model="block.values[output.label]" />

          <input
            v-else-if="INPUT_TYPES.includes(output.type)"
            :type="output.type"
            v-model="block.values[output.label]"
          />

          <textarea
            v-else-if="output.type === 'text'"
            type="text"
            v-model="block.values[output.label]"
          >
          </textarea>

          <select v-else-if="output.type === 'select'" v-model="block.values[output.label]">
            <option></option>
            <option v-for="opt in output.options" :value="opt">{{ opt }}</option>
          </select>

          <span class="indicator input"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.block {
  position: absolute;
  font-size: 0.875rem;
}

.block-title {
  cursor: move;
}

.block-content {
  border: 1px solid #ccc;
  display: flex;
  gap: 0 0.5rem;
}

.block-input,
.block-output {
  display: flex;
  align-items: center;
  gap: 0 0.25rem;
  padding: 1px 0.25rem;
}

.block-output {
  text-align: right;
  justify-content: flex-end;
}

.indicator {
  display: block;
  width: 1rem;
  height: 1rem;
  border: 1px solid #ccc;
}
</style>
