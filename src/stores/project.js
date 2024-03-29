import { ref, reactive, computed, watch } from 'vue'
import { defineStore } from 'pinia'

import Project from '@/models/project.js'

export const state = reactive({
  connected: false
})

export const useProjectStore = defineStore('project', () => {
  const project = ref(null)
  const blocks = computed(() => project.value.blocks)
  const blockMap = computed(() => Object.fromEntries(blocks.value.map((b) => [b.id, b])))

  // const blockByMsg = computed(() =>
  //   Object.fromEntries(blocks.value.filter((b) => b.msgId).map((b) => [b.msgId, b]))
  // )

  // ---- pan / scale canvas

  function relativePos([x, y] = []) {
    const [ox, oy] = project.value.offset
    const scale = project.value.scale

    return [(x - ox) / scale, (y - oy) / scale]
  }

  // ---- block ui related

  const selectedBlocks = ref(new Set())

  function selectBlock(block) {
    clearSelectedBlocks()
    selectedBlocks.value.add(block)
  }

  function toggleBlock(block) {
    if (selectedBlocks.value.has(block)) {
      selectedBlocks.value.delete(block)
    } else {
      selectedBlocks.value.add(block)
    }
  }

  function clearSelectedBlocks() {
    selectedBlocks.value.clear()
  }

  function isBlockSelected(block) {
    return selectedBlocks.value.has(block)
  }

  // ---- block management

  function addBlock(block) {
    project.value.blocks.push(block)
  }

  function clearOutputRefs(block, excepts = []) {
    if (!block._outputs) return
    block._outputs.forEach((ob) => {
      if (excepts.includes(ob.id)) return
      ob.inputs.forEach((inp) => {
        if (inp.source && inp.source.startsWith(block.id)) {
          inp.source = null
        }
      })
    })
  }

  function delBlock(block) {
    const idx = blocks.value.indexOf(block)
    if (idx > -1) {
      clearOutputRefs(block)
      blocks.value.splice(idx, 1)
    }
  }

  function detachBlocks(bs) {
    const blockIds = bs.map((b) => b.id)

    // clean up ios
    bs.forEach((block) => {
      clearOutputRefs(block, blockIds)

      block.inputs.forEach((inp) => {
        if (!inp.source) return

        const fid = inp.source.split('_')[0]
        if (!blockIds.includes(fid)) {
          inp.source = null
        }
      })

      const idx = blocks.value.indexOf(block)
      if (idx > -1) {
        blocks.value.splice(idx, 1)
      }
    })

    return [...bs]
  }

  function updateBlock(id, block) {
    const ext = project.value.blocks.find((b) => b.id === id)
    if (ext) {
      // applyAttrs(ext, block)
      const { id, ...attrs } = block
      Object.assign(ext, attrs)
    }
  }

  // ---- auto save / load with localStorage

  const data = localStorage.getItem('project') || {}
  project.value = new Project().load(data)
  arrangeBlocks()

  console.log(project)

  function save() {
    const pj = project.value
    if (!pj) return

    localStorage.setItem('project', pj.dump())
  }

  watch(project, save, { deep: true })

  // ---- io related

  const selectedInput = ref(null)
  const selectedOutput = ref(null)

  function connectIO() {
    if (
      selectedInput.value &&
      selectedOutput.value &&
      selectedInput.value[0] !== selectedOutput.value[0] //TODO: not allow to connect the same block output to input?
    ) {
      const [block, input] = selectedInput.value
      block.setInput(input.id, ...selectedOutput.value)

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

  // ---- block sequence related

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
    // reset
    blocks.value.forEach((b) => {
      b._weight = null
      b._outputs = new Set()
    })

    blocks.value.forEach((b) => {
      const inps = b.inputs.filter((inp) => inp.source !== null)
      inps.forEach((inp) => {
        const [bid, _] = inp.source.split('_')
        const tb = blockMap.value[bid]
        if (tb) tb._outputs.add(b)
      })
    })

    try {
      blocks.value.forEach(getWeight)
      project.value.blocks = blocks.value.sort((a, b) => b._weight - a._weight)
    } catch (e) {
      console.log('Error: failed to arrange blocks, some blocks has loopd')
      console.log(e)
    }
  }

  return {
    project,
    selectedBlocks,
    selectBlock,
    toggleBlock,
    clearSelectedBlocks,
    isBlockSelected,

    addBlock,
    delBlock,
    updateBlock,
    detachBlocks,
    save,

    selectedInput,
    selectedOutput,
    connectIO,
    elPositions,
    ioPairs,

    relativePos
  }
})
