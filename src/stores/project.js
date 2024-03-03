import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

import Project from '@/models/project.js'

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
      Object.assign(ext, attrs)
    }
  }

  function save() {
    const pj = project.value
    if (!pj) return

    localStorage.setItem('project', pj.dump())
  }

  watch(project, save, { deep: true })

  return { project, addBlock, updateBlock, save }
})