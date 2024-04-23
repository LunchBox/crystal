<script setup>
import { ref } from 'vue'
import { INPUT_TYPES } from '@/models/block_output.js'

import { storeToRefs } from 'pinia'
import { useProjectStore } from '@/stores/project.js'
const store = useProjectStore()
const { project, selectedInput, selectedOutput, elPositions } = storeToRefs(store)
const { connectIO } = store

const props = defineProps(['block', 'input'])
const emit = defineEmits(['reg-ref'])

// TODO: it changed the props data...
function clearArg(input) {
	input.source = null
}

function isOccupied(input) {
	return input.source
}

function isArgSelected(input) {
	if (!selectedInput.value) return false
	const [block, _input] = selectedInput.value
	return block === props.block && input === _input
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
</script>


<template>
  <div class="block-input">
    <span :ref="(el) => $emit('reg-ref', el)" class="indicator input"
      :class="{ active: isArgSelected(input), occupied: isOccupied(input) }" :title="input.source" @mousedown.prevent="mousedownInput(input)"></span>
    <span @mousedown.prevent="mousedownInput(input)" @dblclick.prevent="clearArg(input)">{{ input.label }}</span>
  </div>
</template>
