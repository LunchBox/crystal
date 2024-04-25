<script setup>
import { computed } from "vue"
import BlockView from '@/views/blocks/BlockView.vue'

const props = defineProps(['block'])

const output = computed(() => props.block?.outputs?.[0])

const options = computed(() => props.block?.inputs?.[0]?._sourceObj?.value?.split('\n'))

function updateOutput(el) {
  if (output.value) {
    output.value.value = el.target.value
  }
}

</script>

<template>
  <BlockView :block="block">
  <select v-model="output.value" v-if='output'>
    <option></option>
    <option v-for="opt in options" :key="opt" :value="opt">{{ opt }}</option>
  </select>
  </BlockView>
</template>


<style scoped>
</style>
