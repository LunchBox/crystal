import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

import Project from '@/models/project.js'

function applyAttrs(obj, attrs) {
  Object.keys(attrs).forEach((k) => {
    if (attrs[k] && typeof attrs[k] === 'object') {
      applyAttrs(obj[k], attrs[k])
    } else {
      obj[k] = attrs[k]
    }
  })
}

export const useProjectStore = defineStore('project', () => {
  const project = ref(null)

  const data = localStorage.getItem('project') || {}
  project.value = new Project().load(data)

  function addBlock(block) {
    project.value.blocks.push(block)
  }

  function updateBlock(id, block) {
    const ext = project.value.blocks.find((b) => b.id === id)
    if (ext) {
      const { id: _, ...attrs } = block
      // Object.assign(ext, attrs)
      applyAttrs(ext, attrs)
    }
  }

  function save() {
    const pj = project.value
    if (!pj) return

    localStorage.setItem('project', pj.dump())
  }

  watch(project, save, { deep: true })

  const selectedInput = ref(null)
  const selectedOutput = ref(null)

  function connectIO() {
    if (
      selectedInput.value &&
      selectedOutput.value &&
      selectedInput.value[0] !== selectedOutput.value[0] //TODO: not allow to connect the same block output to input?
    ) {
      const [block, arg] = selectedInput.value
      block.setArg(arg, ...selectedOutput.value)
      console.log(block)
      selectedInput.value = null
      selectedOutput.value = null
    }
  }

  return { project, addBlock, updateBlock, save, selectedInput, selectedOutput, connectIO }
})
