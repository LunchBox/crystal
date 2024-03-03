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
const { project } = storeToRefs(store)

const blocks = computed(() => project.value.blocks)

const addingBlock = ref(false)
const editingBlock = ref(null)

// const b1 = new Block()
// b1.position = [100, 100]

// const b2 = new NumberBlock()
// b2.position = [300, 100]

// const b3 = new Block()
// b3.position = [600, 100]
// b3.title = 'yf.download'
// b3.args = [
//   'tickers',
//   'interval',
//   'period',
//   'start',
//   'end',
//   'prepost',
//   'actions',
//   'auto_adjust',
//   'back_adjust',
//   'repair',
//   'keepna',
//   'rounding',
//   'group_by',
//   'ignore_tz',
//   'threads',
//   'proxy',
//   'session',
//   'timeout',
//   'progress'
// ]

// const b4 = new Block()
// b4.position = [800, 100]
// b4.title = 'yf.download'
// b4.args = [
//   'tickers',
//   'interval',
//   'period',
//   'start',
//   'end',
//   'prepost',
//   'actions',
//   'auto_adjust',
//   'back_adjust',
//   'repair',
//   'keepna',
//   'rounding',
//   'group_by',
//   'ignore_tz',
//   'threads',
//   'proxy',
//   'session',
//   'timeout',
//   'progress'
// ]
// b4.options = {
//   interval: '1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo'.split(', '),
//   period: '1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max'.split(', ')
// }

// const blocks = ref([b1, b2, b3, b4])

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
</script>

<template>
  <h2>{{ project.title }}</h2>
  <div class="toolbar">
    <a href="" class="btn" @click.prevent="save">Save</a>
    <a href="" class="btn" @click.prevent="addingBlock = true">Add Block</a>
    <a href="" class="btn">Run</a>
    <a href="" class="btn">Run Block</a>
  </div>
  <div>
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
