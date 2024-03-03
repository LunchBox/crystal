<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

import { storeToRefs } from 'pinia'
import { useProjectStore } from '@/stores/project.js'

import Project from '@/models/project.js'
import Block from '@/models/block.js'
import NumberBlock from '@/models/number_block'

import BlockView from '../blocks/BlockView.vue'
import AddBlock from '../blocks/AddBlock.vue'
import EditBlock from '../blocks/EditBlock.vue'

const store = useProjectStore()
const { project, selectedInput, selectedOutput, ioPairs, elPositions } = storeToRefs(store)

const blocks = computed(() => project.value.blocks)

const addingBlock = ref(false)
const editingBlock = ref(null)

const dragging = ref(new Set())
function draggingBlock(block) {
  dragging.value.add(block)
}

function mousemove(e) {
  if (dragging.value.size > 0) {
    dragging.value.forEach((item) => {
      const pos = item.position
      if (pos) {
        pos[0] += e.movementX
        pos[1] += e.movementY
      }
    })
  }
}

function mouseup() {
  dragging.value.clear()
}

onMounted(() => {
  document.addEventListener('mousemove', mousemove)
  document.addEventListener('mouseup', mouseup)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', mousemove)
  document.removeEventListener('mouseup', mouseup)
})

// console.log(ioPairs.value)
// onMounted(() => {
//   console.log(elPositions.value)
// })

function curve(pair) {
  const [output, input] = pair

  if (!elPositions.value[output]) return
  if (!elPositions.value[input]) return

  let { x: x1, y: y1 } = elPositions.value[output]
  let { x: x2, y: y2 } = elPositions.value[input]

  return `M ${x1} ${y1}, C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`
}
</script>

<template>
  <h2>{{ project.title }}</h2>
  <div class="toolbar">
    <a href="" class="btn" @click.prevent="save">Save</a>
    <a href="" class="btn" @click.prevent="addingBlock = true">Add Block</a>
    <a href="" class="btn">Run</a>
    <a href="" class="btn">Run Block</a>
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
      @dragging="draggingBlock(block)"
    >
    </BlockView>
  </div>
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
.block-wrapper {
  position: relative;
}

.toolbar {
  display: flex;
  gap: 0 0.5rem;
  font-size: 0.825rem;
}

.btn {
  border: 1px solid #ccc;
  border-radius: 2px;
  padding: 0 0.25rem;
}
</style>
