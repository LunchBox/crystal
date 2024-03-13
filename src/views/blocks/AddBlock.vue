<script setup>
// import { ref } from 'vue'
// import Block from '@/models/block.js'

// import { useProjectStore } from '@/stores/project.js'

// import BlockForm from './BlockForm.vue'
// import DraggablePanel from '@/views/DraggablePanel.vue'

// const emit = defineEmits(['success', 'cancel'])

// const store = useProjectStore()
// const { addBlock } = store

// const block = ref(new Block())

// function onSubmit(blockData) {
// 	addBlock(blockData)
// 	block.value = new Block()
// 	emit('success')
// }
</script>

<template>
	<DraggablePanel @close="$emit('cancel')">
		<template #header>
			<div>Add Block</div>
		</template>

		<template #default>
			<BlockForm :block="block" @submit="onSubmit" @cancel="$emit('cancel')"></BlockForm>
		</template>
	</DraggablePanel>
</template>

<style scoped></style>
