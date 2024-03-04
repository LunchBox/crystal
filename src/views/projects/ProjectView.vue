<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

import { storeToRefs } from 'pinia'
import { useProjectStore } from '@/stores/project.js'

import Project from '@/models/project.js'
import Block from '@/models/block.js'
import NumberBlock from '@/models/number_block'

import BlockInput from '@/models/block_input.js'

import BlockView from '../blocks/BlockView.vue'
import AddBlock from '../blocks/AddBlock.vue'
import EditBlock from '../blocks/EditBlock.vue'

import SVGBackground from './SVGBackground.vue'

const store = useProjectStore()
const {
  canvasOffset,
  canvasScale,
  project,
  selectedInput,
  selectedOutput,
  elPositions,
  selectedBlocks
} = storeToRefs(store)
const { addBlock, delBlock, selectBlock, toggleBlock, isBlockSelected, clearSelectedBlocks } = store

const blocks = computed(() => project.value.blocks)

const addingBlock = ref(false)
const editingBlock = ref(null)

function deleteBlocks() {
  if (selectedBlocks.value.size > 0) {
    const bs = [...selectedBlocks.value]
    bs.forEach(delBlock)
    clearSelectedBlocks()
  }
}

function resetCanvas() {
  canvasScale.value = 1
  canvasOffset.value = [0, 0]
}

// ---- scale

function onWheel(e) {
  // deltaY is always 100/-100 in Windows, but less then 10 in Mac
  let unit = 0.01
  if (Math.abs(e.deltaY) >= 100) {
    unit = unit / 10
  }

  const delta = e.deltaY * unit
  canvasScale.value += delta
}

// ---- dragging related

const draggingBlocks = ref(false)
const draggingCanvas = ref(false)
const cloned = ref(false)

const selecting = ref(false)
const startPos = ref(null)
const currentPos = ref(null)

const canvasStyle = computed(() => {
  const [x, y] = canvasOffset.value
  return {
    top: y + 'px',
    left: x + 'px',
    transform: `scale(${canvasScale.value}, ${canvasScale.value})`
  }
})

const selectionBoxStyle = computed(() => {
  if (!startPos.value || !currentPos.value) return {}

  const [x1, y1] = startPos.value
  const [x2, y2] = currentPos.value
  return {
    top: Math.min(y1, y2) + 'px',
    left: Math.min(x1, x2) + 'px',
    width: Math.abs(x2 - x1) + 'px',
    height: Math.abs(y2 - y1) + 'px'
  }
})

function mousdown(e) {
  cloned.value = false
  clearSelectedBlocks()

  // only activate on left click
  if (e.button === 0) {
    selecting.value = true
    const { pageX: x, pageY: y } = e
    startPos.value = [x, y]
  }

  // right click
  if (e.button === 2) {
    draggingCanvas.value = true
  }
}

function mousedownOnBlock(e, block) {
  if (e.button !== 0) return

  if (!isBlockSelected(block)) {
    if (e.ctrlKey) {
      toggleBlock(block)
    } else {
      selectBlock(block)
    }
  }

  draggingBlocks.value = true
}

function cloneSelections() {
  const clones = [...selectedBlocks.value].map((b) => b.clone())
  clearSelectedBlocks()
  clones.forEach((b) => {
    addBlock(b)
    toggleBlock(b)
  })
  cloned.value = true
}

function moveSelections(e) {
  const scale = canvasScale.value
  const blocks = [...selectedBlocks.value]
  blocks.forEach((block) => {
    const pos = block.position
    if (pos) {
      pos[0] += e.movementX / scale
      pos[1] += e.movementY / scale
    }
  })
}

function moveCanvas(e) {
  canvasOffset.value[0] += e.movementX
  canvasOffset.value[1] += e.movementY
}

function mousemove(e) {
  // only count left button
  if (draggingBlocks.value && selectedBlocks.value.size > 0) {
    // clone blocks on ctrl + drag
    if (e.ctrlKey && !cloned.value) {
      return cloneSelections()
    }

    moveSelections(e)
  }

  if (draggingCanvas.value) {
    moveCanvas(e)
  }

  if (selecting.value) {
    // disable default user-select logic
    e.preventDefault()
    const { pageX: x, pageY: y } = e
    currentPos.value = [x, y]
  }
}

function selectBlocksInRange() {
  if (!startPos.value || !currentPos.value) return

  const [x1, y1] = startPos.value
  const [x2, y2] = currentPos.value

  const [ox, oy] = canvasOffset.value
  const scale = canvasScale.value

  const mx = (Math.min(x1, x2) - ox) / scale
  const my = (Math.min(y1, y2) - oy) / scale
  const mw = Math.abs(x1 - x2) / scale
  const mh = Math.abs(y1 - y2) / scale

  const inRangeBlocks = blocks.value.filter((b) => {
    const rect = elPositions.value[b.id]
    if (!rect) return false
    const { x, y, width, height } = rect
    return x + width > mx && x < mx + mw && y + height > my && y < my + mh
  })

  clearSelectedBlocks()
  inRangeBlocks.forEach(toggleBlock)
}

function mouseup() {
  selectBlocksInRange()

  draggingBlocks.value = false
  draggingCanvas.value = false

  selecting.value = false
  startPos.value = null
  currentPos.value = null
}

onMounted(() => {
  window.addEventListener('mousedown', mousdown)
  document.addEventListener('mousemove', mousemove)
  window.addEventListener('mouseup', mouseup)
})

onBeforeUnmount(() => {
  window.removeEventListener('mousedown', mousdown)
  document.removeEventListener('mousemove', mousemove)
  window.removeEventListener('mouseup', mouseup)
})

function run() {
  blocks.value.forEach((b) => {
    console.log(b.toCode())
  })
}
</script>

<template>
  <h2>{{ project.title }}</h2>
  <div class="toolbar" @mousedown.stop>
    <a href="" class="btn" @click.prevent="save">Save</a>
    <a href="" class="btn" @click.prevent="addingBlock = true">Add Block</a>
    <a href="#" class="btn" @click.prevent="deleteBlocks">Del Blocks</a>
    <a href="" class="btn" @click.prevent="run">Run</a>
    <a href="" class="btn" @click.prevent="run">Run Block</a>
    <a href="" class="btn" @click.prevent="resetCanvas">Reset</a>
  </div>
  <div style="position: absolute; z-index: 2">
    <AddBlock
      v-if="addingBlock"
      @cancel="addingBlock = false"
      @success="addingBlock = false"
    ></AddBlock>

    <EditBlock
      v-if="editingBlock"
      :block="editingBlock"
      @cancel="editingBlock = null"
      @success="editingBlock = null"
    ></EditBlock>
  </div>

  <div class="canvas-outer" @contextmenu.prevent @wheel="onWheel">
    <SVGBackground></SVGBackground>
    <div class="block-wrapper" :style="canvasStyle">
      <BlockView
        v-for="block in blocks"
        :block="block"
        :key="block.id"
        @edit="editingBlock = block"
        @mousedown-on-block="mousedownOnBlock"
      >
      </BlockView>
    </div>
  </div>
  <div v-if="startPos && currentPos" class="selection-box" :style="selectionBoxStyle"></div>
</template>

<style scoped>
svg {
  z-index: -1;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  width: 100%;
  height: 100%;
  display: block;
  margin: 0;
}

.selection-box {
  position: absolute;
  pointer-events: none;
  border: 1px solid green;
}

.block-wrapper {
  transform-origin: top left;
  font-size: 0.75rem;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.canvas-outer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
}

.block-wrapper input,
.block-wrapper textarea,
.block-wrapper select {
  font-size: 0.75rem;
}

.toolbar {
  position: fixed;
  z-index: 10;
  top: 80px;
  display: flex;
  gap: 0 0.5rem;
  font-size: 0.75rem;
}

.btn {
  border: 1px solid #ccc;
  border-radius: 2px;
  padding: 0 0.25rem;
}
</style>
