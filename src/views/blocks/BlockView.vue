<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { INPUT_TYPES } from '@/models/block_output.js'

import { runBlock } from '@/socket.js'

import { storeToRefs } from 'pinia'
import { useProjectStore } from '@/stores/project.js'

const store = useProjectStore()
const { project, selectedInput, selectedOutput, elPositions } = storeToRefs(store)
const { connectIO, isBlockSelected, relativePos } = store

const props = defineProps(['block'])

const emit = defineEmits(['edit', 'mousedown-on-block'])

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

const width = ref('auto')
const height = ref('auto')

watch(() => props.block.width, () => {
  width.value = props.block.width
}, {immediate: true})

watch(() => props.block.height, () => {
  height.value = props.block.height
}, {immediate: true})

const bStyle = computed(() => {
	const [x = 0, y = 0] = props.block.position
	return {
		left: `${x}px`,
		top: `${y}px`,
    width: width.value,
    height: height.value,
	}
})

const bClass = computed(() => {
	return [{ selected: isBlockSelected(props.block) }, props.block.status]
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
	runBlock(props.block)
}

// ------------- io positions
const blockRef = ref(null)
const elRefs = ref({})

let updating = false
function updatePositions() {
	if (updating) return
	updating = true
	Object.entries(elRefs.value).forEach(([id, el]) => {
		if (!el) {
			delete elPositions.value[id]
			return
		}
		const { x: cx, y: cy, width, height } = el.getBoundingClientRect()
		const [x, y] = relativePos([cx, cy])
		elPositions.value[id] = { x, y, width, height }
	})
	updating = false
}

// watch block.position 可以在移動時更新，但修改 block 內容時就不一定能更新了
// watch(() => props.block.position, () => {
// 	nextTick(updatePositions)
// }, { deep: true })

const config = { attributes: true, childList: true, subtree: true }
const callback = function (mutationsList) {
	for (const mutation of mutationsList) {
		console.log(mutation.type)
		if (mutation.type === 'childList') {
			// console.log('A child node has been added or removed.')
			updatePositions()
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
	// window.addEventListener('mouseup', storeWidth)

	window.addEventListener('mousemove', onResizeMarkMove)
	window.addEventListener('mouseup', releaseResizeMark)

	observer.observe(blockRef.value, config)
})

onBeforeUnmount(() => {
	window.removeEventListener('resize', updatePositions)
	// window.removeEventListener('mouseup', storeWidth)

	window.removeEventListener('mousemove', onResizeMarkMove)
	window.removeEventListener('mouseup', releaseResizeMark)

	observer.disconnect()
})

function mousedownOnBlock(e) {
	// 只在被選中後第二次點擊才觸發鼠標事件
	if (isBlockSelected(props.block)) {
		e.preventDefault()
		emit('mousedown-on-block', e, props.block)
	}
}

const resizing = ref(false)
function mousedownOnResizeMark(e) {
  resizing.value = true
}

function onResizeMarkMove(e) {
  if (!resizing.value) return

	const scale = project.value.scale


  let w = parseFloat(width.value) || 0
  let h = parseFloat(height.value) || 0

  if (!width.value || width.value === 'auto' || !height.value || height.value === 'auto' ) {
    let rect = blockRef.value.getBoundingClientRect()
    w = rect.width
    h = rect.height
  }

  w += e.movementX / scale
  h += e.movementY / scale

  console.log(w, h, e.movementX, e.movementY, scale)

  width.value = w + 'px'
  height.value = h + 'px'
}

function releaseResizeMark() {
  resizing.value = false

  props.block.updateSize(width.value, height.value)
}

function resetSize() {
  width.value = 'auto'
  height.value = 'auto'
  props.block.updateSize(width.value, height.value)
}

</script>

<template>
	<div class="block" ref="blockRef" :style="bStyle" :class="bClass" @dblclick.stop
		@mousedown.left.stop="mousedownOnBlock">
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
      <div class="block-io">
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
            <span :title="output.value">{{ output.label }}</span>

            <input v-if="output.type === 'string'" type="text" v-model="output.value" />

            <input v-else-if="INPUT_TYPES.includes(output.type)" :type="output.type" v-model="output.value" />

            <textarea v-else-if="output.type === 'text'" type="text" v-model="output.value"></textarea>

            <select v-else-if="output.type === 'select'" v-model="output.value">
              <option></option>
              <option v-for="opt in output.options" :key="opt" :value="opt">{{ opt }}</option>
            </select>

            <span :ref="(el) => (elRefs[`${block.id}_${output.id}_o`] = el)" class="indicator output"
              :class="{ active: isOutputSelected(output) }" @mousedown.prevent="mousedownOutput(output)"></span>
          </div>
        </div>
			</div>

      <slot></slot>
		</div>


		<div class="block-extra">
			<div>
				<!-- <pre>{{ block.toCode() }}</pre> -->
				<pre>{{ block.stderr }}</pre>
				<pre>{{ block.stdout }}</pre>
				<div v-if="block.displayData">
					<img v-if="block.hasInlineImage" :src="block.inlineImage" :alt="block.inlineImageCaption" />
				</div>
			</div>
		</div>

    <span class='resize-mark' @mousedown.prevent.stop='mousedownOnResizeMark' @dblclick="resetSize"></span>
	</div>
</template>

<style scoped>
.block {
	position: absolute;
	padding: 0.25rem;

	border: 2px solid rgba(0, 0, 0, 0.2);
	border-radius: 3px;

  width: auto;
  min-width: min-content;
  min-height: fit-content;
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

.block-io {
	display: flex;
	gap: 0 0.5rem;

  width: 100%;
  height: 100%;
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

pre {
	width: 600px;
	max-width: 600px;
	white-space: pre-wrap;
	/* Since CSS 2.1 */
	white-space: -moz-pre-wrap;
	/* Mozilla, since 1999 */
	white-space: -pre-wrap;
	/* Opera 4-6 */
	white-space: -o-pre-wrap;
	/* Opera 7 */
	word-wrap: break-word;
	/* Internet Explorer 5.5+ */
}


.resize-mark {
  width: 10px;
  height: 10px;

  position: absolute;
  right: 0;
  bottom: 0;

  cursor: nwse-resize;
}
</style>
