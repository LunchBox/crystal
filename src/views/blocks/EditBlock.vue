<script setup>
import { ref } from 'vue'
import Block from '@/models/block.js'

import { useProjectStore } from '@/stores/project.js'

import BlockForm from './BlockForm.vue'
import DraggablePanel from '@/views/DraggablePanel.vue'

const props = defineProps(['block', 'pos'])

const emit = defineEmits(['success', 'cancel'])

const store = useProjectStore()
const { updateBlock } = store

function onSubmit(blockData) {
  updateBlock(props.block.id, blockData)
  emit('success')
}
</script>

<template>
  <DraggablePanel @close="$emit('cancel')" :pos="pos">
    <template #header>
      <div>Edit Block</div>
    </template>

    <template #default>
      <BlockForm :block="block" @submit="onSubmit" @cancel="$emit('cancel')"></BlockForm>
    </template>
  </DraggablePanel>
</template>

<style scoped></style>
