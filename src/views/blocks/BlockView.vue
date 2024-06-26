<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { INPUT_TYPES } from '@/models/block_output.js'

import { runBlock } from '@/socket.js'

import { storeToRefs } from 'pinia'
import { useProjectStore } from '@/stores/project.js'

import BlockInput from './BlockInput.vue'
import BlockOutput from './BlockOutput.vue'

const store = useProjectStore()
const { project, selectedInput, selectedOutput, elPositions } = storeToRefs(store)
const { connectIO, isBlockSelected, relativePos } = store

const props = defineProps(['block'])

const emit = defineEmits(['edit', 'mousedown-on-block'])

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
    maxWidth: (!width.value || width.value === 'auto') ? '640px' : 'none'
	}
})

const bClass = computed(() => {
	return [{ selected: isBlockSelected(props.block) }, props.block.status]
})


function run() {
	runBlock(props.block)
}

// ------------- io positions
const blockRef = ref(null)
const elRefs = ref({})


function regOutputEl(output, el) {
  elRefs.value[`${props.block.id}_${output.id}_o`] = el
}

function regInputEl(input, el) {
  elRefs.value[`${props.block.id}_${input.id}_i`] = el
}


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

const hasInputs = computed(() => props.block.inputs && props.block.inputs.length > 0)
const hasOutputs = computed(() => props.block.outputs && props.block.outputs.length > 0)


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
      <div v-if="hasInputs || hasOutputs" class="block-io">
        <div v-if="hasInputs" class="block-inputs">
          <block-input :block="block" :input="input" v-for="input in block.inputs" :key="input.id" @reg-ref="(el) => regInputEl(input, el)"></block-input>
        </div>
        <div v-if="hasOutputs" class="block-outputs">
          <block-output :block="block" :output="output" v-for="output in block.outputs" :key="output.id" @reg-ref="(el) => regOutputEl(output, el)"></block-output>
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
  min-height: min-content;

  display: flex;
  flex-direction: column;
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
  flex: 1;
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

  display: flex;
  flex-direction: column;
}

.block-stderr {
	color: red;
}

:deep() .indicator {
	display: block;
	width: 8px;
	height: 8px;
	background: #ccc;
}

:deep() .indicator.occupied {
	background: gray;
}

:deep() .indicator.active {
	background: orange;
}

pre {
	font-size: 0.625rem;
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


.block-extra {
	position: relative;
}

.block-extra>* {
	position: absolute;
	top: 1rem;
}

.resize-mark {
  width: .5rem;
  height: .5rem;

  position: absolute;
  right: 0;
  bottom: 0;

  cursor: nwse-resize;
}
</style>
