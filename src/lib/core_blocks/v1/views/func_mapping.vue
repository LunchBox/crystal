<script setup>
import BlockView from '@/views/blocks/BlockView.vue'
defineProps(['block'])
</script>
<template>
  <BlockView :block="block"></BlockView>
</template>
