<script setup>
import { ref, watch } from 'vue'
import BlockOutput from '@/models/block_output.js'
import { OUTPUT_TYPES } from '@/models/block_output.js'


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

function addInput() {
	formData.value.addInput()
}

function delInput(idx) {
	formData.value.delInput(idx)
}

function addOutput() {
	formData.value.addOutput()
}

function delOutput(idx) {
	formData.value.delOutput(idx)
}

function addOutputOption(outputIdx) {
	formData.value.outputs[outputIdx].options.push('')
}

function delOutputOption(outputIdx, optIdx) {
	formData.value.delOutputOption(outputIdx, optIdx)
}

function onSubmit() {
	emit('submit', formData.value)
}

function insertTabCharacter(target) {
	const { value, selectionStart: start, selectionEnd: end } = target

	// Insert tab character
	target.value = `${value.substring(0, start)}\t${value.substring(end)}`

	// Move cursor to new position
	target.selectionStart = target.selectionEnd = start + 1
}

function onTab(e) {
	insertTabCharacter(e.target)
}
</script>

<template>
	<form @submit.prevent.stop="onSubmit">
		<div>type: {{ formData.type }}</div>
		<div>
			<div class="field">
				<label>
					<span>Title</span>
					<input type="text" v-model="formData.title" />
				</label>
			</div>

			<div class="field">
				<label>Args</label>
				<div v-for="(input, idx) in formData.inputs" :key="input">
					<input type="text" v-model="formData.inputs[idx].label" />
					<button @click.prevent="delInput(idx)">X</button>
				</div>
				<button @click.prevent="addInput">Add Input</button>
			</div>

			<div class="field">
				<label>
					<input type="checkbox" v-model="formData.namedArgs" /> use named args in function
				</label>
			</div>

			<div class="field">
				<label>Outputs</label>
				<div v-for="(output, outputIdx) in formData.outputs" :key="output">
					<input type="text" v-model="formData.outputs[outputIdx].label" required />
					<select v-model="formData.outputs[outputIdx].type">
						<option v-for="tp in OUTPUT_TYPES" :key="tp">{{ tp }}</option>
					</select>

					<button @click.prevent="delOutput(outputIdx)">X</button>

					<div v-if="output.type === 'select'">
						<div v-for="(opt, optIdx) in formData.outputs[outputIdx].options" :key="opt">
							<input type="text" v-model="formData.outputs[outputIdx].options[optIdx]" />
							<button @click.prevent="delOutputOption(outputIdx, optIdx)">X</button>
						</div>
						<button @click.prevent="addOutputOption(outputIdx)">Add Option</button>
					</div>
				</div>
				<button @click.prevent="addOutput">Add Output</button>
			</div>

			<div>
				<label>
					<span>Content</span>
					<textarea v-model="formData.content" @keydown.tab.prevent.stop="onTab"></textarea>
				</label>
			</div>

			<div class="actions">
				<input type="submit" value="Save" />
				<a href="#" @click.prevent="$emit('cancel')">Cancel</a>
			</div>
		</div>
	</form>
</template>

<style scoped>
.field {
	margin: 0.5rem 0;
}

label {
	display: block;
}

label>span {
	display: block;
}

textarea {
	display: block;
	box-sizing: border-box;
	width: 400px;
	height: 120px;
}
</style>
