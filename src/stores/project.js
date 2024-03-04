import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

import Project from '@/models/project.js'

function applyAttrs(obj, attrs) {
  Object.keys(attrs).forEach((k) => {
    if (k === 'id') return
    if (obj[k] === null || obj[k] === undefined) {
      obj[k] = attrs[k]
    } else if (attrs[k] && typeof attrs[k] === 'object') {
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
  arrangeBlocks()

  function addBlock(block) {
    project.value.blocks.push(block)
  }

  function updateBlock(id, block) {
    const ext = project.value.blocks.find((b) => b.id === id)
    if (ext) {
      applyAttrs(ext, block)
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
      const [block, input] = selectedInput.value
      block.setArg(input.id, ...selectedOutput.value)

      console.log(block)
      selectedInput.value = null
      selectedOutput.value = null

      arrangeBlocks()
    }
  }

  const elPositions = ref({})

  const ioPairs = computed(() => {
    const blocks = project.value.blocks
    const idPairs = blocks
      .map((b) => {
        return b.inputs
          .filter((input) => input.source !== null)
          .map((input) => {
            return [`${input.source}_o`, `${b.id}_${input.id}_i`]
          })
      })
      .flat()

    return idPairs
  })

  function getWeight(block) {
    if (block._weight !== null) return block._weight

    if (block._outputs && block._outputs.size > 0) {
      const subWeights = [...block._outputs].map(getWeight)
      block._weight = Math.max(...subWeights) + 1
    } else {
      block._weight = 0
    }
    return block._weight
  }

  function arrangeBlocks() {
    const blocks = project.value.blocks

    // reset
    blocks.forEach((b) => {
      b._weight = null
      b._outputs = new Set()
    })

    const blockMap = Object.fromEntries(blocks.map((b) => [b.id, b]))
    blocks.forEach((b) => {
      const inps = b.inputs.filter((inp) => inp.source !== null)
      inps.forEach((inp) => {
        const [bid, _] = inp.source.split('_')
        const tb = blockMap[bid]
        if (tb) tb._outputs.add(b)
      })
    })

    try {
      blocks.forEach(getWeight)
      project.value.blocks = blocks.sort((a, b) => b._weight - a._weight)
    } catch (e) {
      console.log('Error: failed to arrange blocks, some blocks has loopd')
      console.log(e)
    }
  }

  return {
    project,
    addBlock,
    updateBlock,
    save,
    selectedInput,
    selectedOutput,
    connectIO,
    elPositions,
    ioPairs
  }
})
