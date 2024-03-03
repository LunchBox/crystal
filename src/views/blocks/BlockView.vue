<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { INPUT_TYPES } from '@/models/block_output.js'

import { storeToRefs } from 'pinia'
import { useProjectStore } from '@/stores/project.js'

const store = useProjectStore()
const { selectedInput, selectedOutput, elPositions } = storeToRefs(store)
const { connectIO } = store

const props = defineProps(['block'])

defineEmits(['edit', 'dragging'])

function clearArg(arg) {
  props.block.argsMap[arg] = null
}

function mousedownInput(arg) {
  if (selectedInput.value) {
    const [block, _arg] = selectedInput.value
    if (block === props.block && arg === _arg) {
      selectedInput.value = null
    } else {
      selectedInput.value = [props.block, arg]
    }
  } else {
    selectedInput.value = [props.block, arg]
    connectIO()
  }
}
function mousedownOutput(label) {
  if (selectedOutput.value) {
    const [block, _label] = selectedOutput.value
    if (block === props.block && label === _label) {
      selectedOutput.value = null
    } else {
      selectedOutput.value = [props.block, label]
    }
  } else {
    selectedOutput.value = [props.block, label]
    connectIO()
  }
}

const bStyle = computed(() => {
  const [x = 0, y = 0] = props.block.position
  return {
    left: `${x}px`,
    top: `${y}px`
  }
})

function isArgSelected(arg) {
  if (!selectedInput.value) return false
  const [block, _arg] = selectedInput.value
  return block === props.block && arg === _arg
}

function isOutputSelected(label) {
  if (!selectedOutput.value) return false
  const [block, _label] = selectedOutput.value
  return block === props.block && label === _label
}

function isOccupied(arg) {
  return props.block.argsMap[arg]
}

const blockRef = ref(null)
const elRefs = ref({})

function updatePositions() {
  Object.entries(elRefs.value).forEach(([id, el]) => {
    const rect = el.getBoundingClientRect()
    elPositions.value[id] = rect
  })
}

onMounted(() => {
  updatePositions()

  window.addEventListener('resize', updatePositions)

  const config = { attributes: true, childList: true, subtree: true }
  const callback = function (mutationsList, observer) {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        console.log('A child node has been added or removed.')
      } else if (mutation.type === 'attributes') {
        console.log('A ' + mutation.attributeName + ' attribute was modified.')
        updatePositions()
      }
    }
  }
  const observer = new MutationObserver(callback)
  observer.observe(blockRef.value, config)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updatePositions)
})
</script>

<template>
  <div class="block" :style="bStyle" ref="blockRef">
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
          <span
            :ref="(el) => (elRefs[`${block.id}_${arg}_i`] = el)"
            class="indicator input"
            :class="{ active: isArgSelected(arg), occupied: isOccupied(arg) }"
            :title="block.argsMap[arg]"
            @mousedown.prevent="mousedownInput(arg)"
            @dblclick.prevent="clearArg(arg)"
          ></span>
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

          <span
            :ref="(el) => (elRefs[`${block.id}_${output.label}_o`] = el)"
            class="indicator output"
            :class="{ active: isOutputSelected(output.label) }"
            @mousedown.prevent="mousedownOutput(output.label)"
          ></span>
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
  border: 1px solid gray;
}

.indicator.occupied {
  background: gray;
}

.indicator.active {
  background: orange;
}
</style>
