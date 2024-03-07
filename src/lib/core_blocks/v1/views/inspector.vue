<script setup>
import BlockView from '@/views/blocks/BlockView.vue'
defineProps(['block'])
</script>

<template>
	<BlockView :block="block">
		<div>this is inspector</div>
		<pre>{{ block.content }}</pre>
	</BlockView>
</template>


<style scoped>
pre {
	white-space: pre-wrap;
	/* Since CSS 2.1 */
	white-space: -moz-pre-wrap;
	/* Mozilla, since 1999 */
	white-space: -pre-wrap;
	/* Opera 4-6 */
	white-space: -o-pre-wrap;
	/* Opera 7 */
	word-wrap: break-word;
	/* Internet Explorer 5.5+ */
}
</style>