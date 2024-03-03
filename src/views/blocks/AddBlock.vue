<script setup>
import { ref } from 'vue'
import Block from '@/models/block.js'

import { useProjectStore } from '@/stores/project.js'

import BlockForm from './BlockForm.vue'

const emit = defineEmits(['success', 'cancel'])

const store = useProjectStore()
const { addBlock } = store

const block = ref(new Block())

function onSubmit(blockData) {
  addBlock(blockData)
  block.value = new Block()
  emit('success')
}
</script>

<template>
  <div>Add Block</div>
  <BlockForm :block="block" @submit="onSubmit" @cancel="$emit('cancel')"></BlockForm>
</template>

<style scoped></style>
