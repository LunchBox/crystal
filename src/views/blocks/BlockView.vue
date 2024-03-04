<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { INPUT_TYPES } from '@/models/block_output.js'

import { run as runOnKernel } from '@/socket.js'

import { storeToRefs } from 'pinia'
import { useProjectStore } from '@/stores/project.js'

const store = useProjectStore()
const { selectedInput, selectedOutput, elPositions } = storeToRefs(store)
const { connectIO } = store

const props = defineProps(['block'])

defineEmits(['edit', 'dragging'])

// TODO: it changed the props data...
function clearArg(input) {
  input.source = null
}

function mousedownInput(input) {
  if (selectedInput.value) {
    const [block, _input] = selectedInput.value
    if (block === props.block && input === _input) {
      selectedInput.value = null
    } else {
      selectedInput.value = [props.block, input]
    }
  } else {
    selectedInput.value = [props.block, input]
    connectIO()
  }
}
function mousedownOutput(output) {
  if (selectedOutput.value) {
    const [block, _output] = selectedOutput.value
    if (block === props.block && output === _output) {
      selectedOutput.value = null
    } else {
      selectedOutput.value = [props.block, output]
    }
  } else {
    selectedOutput.value = [props.block, output]
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

function isArgSelected(input) {
  if (!selectedInput.value) return false
  const [block, _input] = selectedInput.value
  return block === props.block && input === _input
}

function isOutputSelected(output) {
  if (!selectedOutput.value) return false
  const [block, _output] = selectedOutput.value
  return block === props.block && output === _output
}

function isOccupied(input) {
  return input.source
}

function run() {
  console.log(props.block.toCode())
  runOnKernel(props.block)
}

// ------------- io positions
const blockRef = ref(null)
const elRefs = ref({})

function updatePositions() {
  Object.entries(elRefs.value).forEach(([id, el]) => {
    const rect = el.getBoundingClientRect()
    elPositions.value[id] = rect
  })
}

const config = { attributes: true, childList: true, subtree: true }
const callback = function (mutationsList, observer) {
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      // console.log('A child node has been added or removed.')
    } else if (mutation.type === 'attributes') {
      // console.log('A ' + mutation.attributeName + ' attribute was modified.')
      updatePositions()
    }
  }
}
const observer = new MutationObserver(callback)

onMounted(() => {
  updatePositions()

  window.addEventListener('resize', updatePositions)

  observer.observe(blockRef.value, config)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updatePositions)
  observer.disconnect()
})
</script>

<template>
  <div class="block" :style="bStyle" ref="blockRef">
    <div
      class="block-title"
      @dblclick.prevent="$emit('edit', block)"
      @mousedown.prevent="$emit('dragging', block)"
    >
      [{{ block.msgIdx }}] {{ block.title }} {{ block.status }}

      <a v-if="block.status === 'idle'" href="#" @click.prevent="run">Run</a>
    </div>
    <div class="block-content">
      <div class="block-inputs">
        <div class="block-input" v-for="input in block.inputs" :key="input.id">
          <span
            :ref="(el) => (elRefs[`${block.id}_${input.id}_i`] = el)"
            class="indicator input"
            :class="{ active: isArgSelected(input), occupied: isOccupied(input) }"
            :title="input.source"
            @mousedown.prevent="mousedownInput(input)"
            @dblclick.prevent="clearArg(input)"
          ></span>
          <span>{{ input.label }}</span>
        </div>
      </div>
      <div class="block-outputs">
        <div class="block-output" v-for="output in block.outputs" :key="output.id">
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
            :ref="(el) => (elRefs[`${block.id}_${output.id}_o`] = el)"
            class="indicator output"
            :class="{ active: isOutputSelected(output) }"
            @mousedown.prevent="mousedownOutput(output)"
          ></span>
        </div>
      </div>
    </div>
    <div class="block-stdout">
      <pre>{{ block.stdout }}</pre>
    </div>
    <div v-if="block.displayData">
      <img v-if="block.hasInlineImage" :src="block.inlineImage" :alt="block.inlineImageCaption" />
    </div>
  </div>
</template>

<style scoped>
.block {
  position: absolute;
  /* font-size: 0.875rem; */
}

.block-title {
  cursor: move;
}

.block-content {
  border: 1px solid #ccc;
  display: inline-flex;
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

pre {
  font-size: 0.625rem;
}
</style>
