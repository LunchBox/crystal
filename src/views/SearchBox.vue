<script setup>
import { ref, computed } from 'vue'
import CoreBlocks from '@/lib/core_blocks/v1/models'

import FuncMapping from '@/lib/core_blocks/v1/models/func_mapping.js';

import { useProjectStore } from '@/stores/project.js'

const store = useProjectStore()
const { addBlock, relativePos } = store

const props = defineProps(['pos'])
const emit = defineEmits(['dragging-block', 'close'])

const style = computed(() => {
	const { x = 0, y = 0 } = props.pos || {}
	return {
		left: `${x}px`,
		top: `${y}px`
	}
})

function draggingBlock(blockType) {
	emit('dragging-block', blockType)
}

const func = ref(null)

function onApply() {
	console.log(func.value)

	if (!func.value || func.value.trim() === "") return

	const { x = 0, y = 0 } = props.pos || {}
	const b = new FuncMapping()
	b.position = relativePos([x, y])

	const funcCode = func.value.trim()
	b.content = funcCode
	b.title = funcCode

	addBlock(b)
	emit('close')
}


</script>

<template>
	<div class="search-box" :style="style">
		<div>
			<input type="text" v-model="func" @keydown.enter.prevent="onApply" autofocus placeholder="type to search">
		</div>

		<div style="margin: .5rem 0;">
			<ul>
				<li v-for="(v, k) in CoreBlocks" :key="k">
					<a href="#" class="btn" @mousedown.prevent.stop="draggingBlock(k)">
						Add {{ k.split('/').pop() }}
					</a>
				</li>
			</ul>
		</div>
	</div>
</template>

<style scoped>
.search-box {
	position: absolute;
	z-index: 2;

	font-size: .75rem;
	padding: 0.25rem;

	background: rgba(255, 255, 255, 0.9);
	border: 2px solid rgba(0, 0, 0, 0.2);
	border-radius: 3px;
}

input {
	background: #efefef;
	border: none;
	box-sizing: border-box;
	display: inline-block;
	margin: 2px;
	padding-top: 4px;
	padding-bottom: 4px;
}
</style>