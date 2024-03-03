<script setup>
import { ref, watch } from 'vue'
import Block from '@/models/block.js'

import { useProjectStore } from '@/stores/project.js'

const props = defineProps(['block'])

const emit = defineEmits(['submit', 'cancel'])

const formData = ref(null)
watch(
  () => props.block,
  (val) => {
    formData.value = val.clone()
  },
  { immediate: true }
)

function addArg() {
  formData.value.args.push('arg')
}

function delArg(idx) {
  formData.value.args.splice(idx, 1)
}

function addOutput() {
  formData.value.outputs.push('output')
}

function delOutput(idx) {
  formData.value.outputs.splice(idx, 1)
}

function onSubmit() {
  emit('submit', formData.value)
}
</script>

<template>
  <form @submit.prevent.stop="onSubmit">
    <div>
      <div>
        <label>
          <span>Title</span>
          <input type="text" v-model="formData.title" />
        </label>
      </div>

      <div>
        <label>Args</label>
        <div v-for="(arg, idx) in formData.args">
          <input type="text" v-model="formData.args[idx]" />
          <button @click.prevent="delArg(idx)">X</button>
        </div>
        <button @click.prevent="addArg">Add Arg</button>
      </div>

      <div>
        <label>Outputs</label>
        <div v-for="(arg, idx) in formData.outputs">
          <input type="text" v-model="formData.outputs[idx]" />
          <button @click.prevent="delOutput(idx)">X</button>
        </div>
        <button @click.prevent="addOutput">Add Output</button>
      </div>

      <div>
        <label>
          <span>Code</span>
          <textarea v-model="formData.code"></textarea>
        </label>
      </div>

      <div>
        <input type="submit" value="Save" />
        <a href="#" @click.prevent="$emit('cancel')">Cancel</a>
      </div>
    </div>
  </form>
</template>

<style scoped>
textarea {
  display: block;
  box-sizing: border-box;
}
</style>
