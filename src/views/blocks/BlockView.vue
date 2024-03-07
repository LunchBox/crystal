<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { INPUT_TYPES } from '@/models/block_output.js'

import { run as runOnKernel } from '@/socket.js'

import { storeToRefs } from 'pinia'
import { useProjectStore } from '@/stores/project.js'

const store = useProjectStore()
const { selectedInput, selectedOutput, elPositions } = storeToRefs(store)
const { connectIO, isBlockSelected, relativePos } = store

const props = defineProps(['block'])

defineEmits(['edit', 'mousedown-on-block'])

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
		if (!el) {
			delete elPositions.value[id]
			return
		}
		const { x, y, width, height } = el.getBoundingClientRect()
		elPositions.value[id] = { ...relativePos({ x, y }), width, height }
	})
}

const config = { attributes: true, childList: true, subtree: true }
const callback = function (mutationsList) {
	for (const mutation of mutationsList) {
		if (mutation.type === 'childList') {
			console.log('A child node has been added or removed.')
			updatePositions()
		} else if (mutation.type === 'attributes') {
			console.log('A ' + mutation.attributeName + ' attribute was modified.')
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
	<div class="block" ref="blockRef" :style="bStyle" :class="[{ selected: isBlockSelected(block) }, block.status]"
		@mousedown.left.stop>
		<div class="block-title" :ref="(el) => (elRefs[`${block.id}`] = el)" @contextmenu.prevent
			@mousedown.prevent.stop="$emit('mousedown-on-block', $event, block)">

			<span @dblclick.prevent="$emit('edit', $event, block)">
				[{{ block.msgIdx }}] {{ block.title }}
			</span>

			<template v-if="block.runnable">
				<a href="#" @mousedown.stop @click.prevent="run"> Run </a>
			</template>
		</div>
		<div class="block-content">
			<div class="block-inputs">
				<div class="block-input" v-for="input in block.inputs" :key="input.id">
					<span :ref="(el) => (elRefs[`${block.id}_${input.id}_i`] = el)" class="indicator input"
						:class="{ active: isArgSelected(input), occupied: isOccupied(input) }" :title="input.source"
						@mousedown.prevent="mousedownInput(input)" @dblclick.prevent="clearArg(input)"></span>
					<span>{{ input.label }}</span>
				</div>
			</div>
			<div class="block-outputs">
				<div class="block-output" v-for="output in block.outputs" :key="output.id">
					<span>{{ output.label }}</span>

					<input v-if="output.type === 'string'" type="text" v-model="block.values[output.label]" />

					<input v-else-if="INPUT_TYPES.includes(output.type)" :type="output.type"
						v-model="block.values[output.label]" />

					<textarea v-else-if="output.type === 'text'" type="text" v-model="block.values[output.label]">
			</textarea>

					<select v-else-if="output.type === 'select'" v-model="block.values[output.label]">
						<option></option>
						<option v-for="opt in output.options" :key="opt" :value="opt">{{ opt }}</option>
					</select>

					<span :ref="(el) => (elRefs[`${block.id}_${output.id}_o`] = el)" class="indicator output"
						:class="{ active: isOutputSelected(output) }" @mousedown.prevent="mousedownOutput(output)"></span>
				</div>
			</div>
		</div>

		<slot></slot>

		<div class="block-extra">
			<div class="block-stderr">
				<pre>{{ block.stderr }}</pre>
			</div>
			<div class="block-stdout">
				<pre>{{ block.stdout }}</pre>
			</div>
			<div v-if="block.displayData">
				<img v-if="block.hasInlineImage" :src="block.inlineImage" :alt="block.inlineImageCaption" />
			</div>
		</div>
	</div>
</template>

<style scoped>
.block {
	position: absolute;
	padding: 0.25rem;
	border: 2px solid rgba(0, 0, 0, 0.2);
	border-radius: 3px;
	max-width: 300px;
}

.block.busy {
	background: #ccc;
}

.block.selected {
	border-color: orange;
}

.block-title {
	white-space: nowrap;
	display: flex;
	gap: 0 0.25rem;
	align-items: baseline;

	cursor: default;
}

.block-content {
	display: flex;
	gap: 0 0.5rem;
}

.block.selected {
	z-index: 10;
}

.block-outputs {
	margin-left: auto;
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

.block-stderr {
	color: red;
}

.indicator {
	display: block;
	width: 8px;
	height: 8px;
	background: #ccc;
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

.block-extra {
	position: relative;
}

.block-extra>* {
	position: absolute;
	top: 1rem;
}
</style>
