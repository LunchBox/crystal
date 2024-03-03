<script setup>
import { computed } from 'vue'
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
          <span>{{ arg }}</span>
          <div v-if="block.options[arg]">
            <select name="" id="">
              <option v-for="opt in block.options[arg]" :value="opt">{{ opt }}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="block-outputs">
        <div class="block-output" v-for="output in block.outputs" :key="output">
          <span>{{ output }}</span>
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
  padding: 0 0.25rem;
  display: flex;
  gap: 0 0.25rem;
}

.block-output {
  text-align: right;
}
</style>
