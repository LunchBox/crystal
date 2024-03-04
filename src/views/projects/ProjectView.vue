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

const store = useProjectStore()
const { project, selectedInput, selectedOutput, ioPairs, elPositions, selectedBlocks } =
  storeToRefs(store)
const { selectBlock, toggleBlock, isBlockSelected } = store

const blocks = computed(() => project.value.blocks)

const addingBlock = ref(false)
const editingBlock = ref(null)

const dragging = ref(false)

function mousedownOnBlock(e, block) {
  if (!isBlockSelected(block)) {
    if (e.ctrlKey) {
      toggleBlock(block)
    } else {
      selectBlock(block)
    }
  }

  dragging.value = true
}

function mousemove(e) {
  if (dragging.value && selectedBlocks.value.size > 0) {
    const blocks = [...selectedBlocks.value]
    blocks.forEach((block) => {
      const pos = block.position
      if (pos) {
        pos[0] += e.movementX
        pos[1] += e.movementY
      }
    })
  }
}

function mouseup() {
  dragging.value = false
}

onMounted(() => {
  console.log(ioPairs)
  document.addEventListener('mousemove', mousemove)
  window.addEventListener('mouseup', mouseup)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', mousemove)
  window.removeEventListener('mouseup', mouseup)
})

function curve(pair) {
  const [output, input] = pair

  if (!elPositions.value[output]) return
  if (!elPositions.value[input]) return

  let { x: x1, y: y1 } = elPositions.value[output]
  let { x: x2, y: y2 } = elPositions.value[input]

  return `M ${x1} ${y1}, C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`
}

function run() {
  blocks.value.forEach((b) => {
    console.log(b.toCode())
  })
}
</script>

<template>
  <h2>{{ project.title }}</h2>
  <div class="toolbar">
    <a href="" class="btn" @click.prevent="save">Save</a>
    <a href="" class="btn" @click.prevent="addingBlock = true">Add Block</a>
    <a href="" class="btn" @click.prevent="run">Run</a>
    <a href="" class="btn" @click.prevent="run">Run Block</a>
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
  <div class="block-wrapper">
    <svg xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(8, 8)" stroke-width="1.5" stroke="#999" fill="transparent">
        <path v-for="pair in ioPairs" :d="curve(pair)" />
      </g>
    </svg>

    <BlockView
      v-for="block in blocks"
      :block="block"
      :key="block.id"
      @edit="editingBlock = block"
      @mousedown-on-block="mousedownOnBlock"
    >
    </BlockView>
  </div>
</template>

<style scoped>
svg {
  z-index: -1;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  width: 100%;
  height: 100%;
  display: block;
  margin: 0;
}

.block-wrapper {
  font-size: 0.75rem;
}
.block-wrapper input,
.block-wrapper textarea,
.block-wrapper select {
  font-size: 0.75rem;
}

.toolbar {
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
