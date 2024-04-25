<script setup>
import { ref, computed } from 'vue'
import { INPUT_TYPES } from '@/models/block_output.js'

import { storeToRefs } from 'pinia'
import { useProjectStore } from '@/stores/project.js'
const store = useProjectStore()
const { project, selectedInput, selectedOutput, elPositions } = storeToRefs(store)
const { connectIO } = store

const props = defineProps(['block', 'output'])
const emit = defineEmits(['reg-ref'])

function isOutputSelected(output) {
	if (!selectedOutput.value) return false
	const [block, _output] = selectedOutput.value
	return block === props.block && output === _output
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

// const options = computed(() => props.output.options)

const options = computed(() => {
  const op = props.output
  console.log(op)
  if (op._dataSource) {
    return op?._dataSource?._sourceObj?.value?.split('\n')
  } else {
    return op?.options
  }
})

</script>

<template>
  <div class="block-output">
    <span :title="output.value" @mousedown.prevent="mousedownOutput(output)">{{ output.label }}</span>

    {{ output.computedOptions }}

    <input v-if="output.type === 'string'" type="text" v-model="output.value" />

    <input v-else-if="INPUT_TYPES.includes(output.type)" :type="output.type" v-model="output.value" />

    <textarea v-else-if="output.type === 'text'" type="text" v-model="output.value"></textarea>

    <select v-else-if="output.type === 'select'" v-model="output.value">
      <option></option>
      <option v-for="opt in options" :key="opt" :value="opt">{{ opt }}</option>
    </select>

    <span :ref="el => $emit('reg-ref', el)" class="indicator output" :class="{ active: isOutputSelected(output) }" @mousedown.prevent="mousedownOutput(output)"></span>
  </div>
</template>

<style scoped>
.block-output {
  flex: 1;
}

.block-output textarea {
  display: block;
  height: 100%;

  resize: none;
}

.block-output {
	display: flex;
	align-items: baseline;
	gap: 0 0.25rem;
  padding: 0;

	text-align: right;
	justify-content: flex-end;
}

input,
select,
textarea {
	background: #efefef;
	border: none;
	box-sizing: border-box;
	display: inline-block;
	margin: 2px;
	padding-top: 4px;
	padding-bottom: 4px;
}
</style>
