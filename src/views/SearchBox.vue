<script setup>
import { computed } from 'vue'
const props = defineProps(['pos'])

const style = computed(() => {
	const { x = 0, y = 0 } = props.pos || {}
	return {
		left: `${x}px`,
		top: `${y}px`
	}
})
</script>

<template>
	<div class="search-box" :style="style">
		<input type="text" autofocus placeholder="type to search">
	</div>
</template>

<style scoped>
.search-box {
	position: absolute;
	z-index: 2;

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