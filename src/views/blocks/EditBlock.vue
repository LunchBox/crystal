<script setup>
import { ref } from 'vue'
import Block from '@/models/block.js'

import { useProjectStore } from '@/stores/project.js'

import BlockForm from './BlockForm.vue'

const props = defineProps(['block'])

const emit = defineEmits(['success', 'cancel'])

const store = useProjectStore()
const { updateBlock } = store

function onSubmit(blockData) {
  updateBlock(props.block.id, blockData)
  emit('success')
}
</script>

<template>
  <div>Edit Block</div>
  <BlockForm :block="block" @submit="onSubmit" @cancel="$emit('cancel')"></BlockForm>
</template>

<style scoped></style>
