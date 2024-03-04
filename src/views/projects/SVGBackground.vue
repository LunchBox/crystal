<script setup>
import { storeToRefs } from 'pinia'
import { useProjectStore } from '@/stores/project.js'

const store = useProjectStore()
const { elPositions, canvasOffset, ioPairs } = storeToRefs(store)

function curve(pair) {
  const [output, input] = pair

  if (!elPositions.value[output]) return
  if (!elPositions.value[input]) return

  const [ox, oy] = canvasOffset.value

  let { x: x1, y: y1 } = elPositions.value[output]
  let { x: x2, y: y2 } = elPositions.value[input]

  const md1 = Math.max((x1 + x2) / 2, x1 + Math.abs(y1 - y2))
  const md2 = Math.min((x1 + x2) / 2, x2 - Math.abs(y1 - y2))

  return `M ${x1} ${y1}, C ${md1} ${y1}, ${md2} ${y2}, ${x2} ${y2}`
}
</script>
<template>
  <svg xmlns="http://www.w3.org/2000/svg">
    <defs data-v-2be30919="">
      <pattern
        id="smallGrid"
        width="12"
        height="12"
        patternUnits="userSpaceOnUse"
        data-v-2be30919=""
      >
        <path
          d="M 12 0 L 0 0 0 12"
          fill="none"
          stroke="#eee"
          stroke-width="0.5"
          data-v-2be30919=""
        ></path>
      </pattern>
      <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse" data-v-2be30919="">
        <rect width="48" height="48" fill="url(#smallGrid)" data-v-2be30919=""></rect>
        <path
          d="M 48 0 L 0 0 0 48"
          fill="none"
          stroke="#999"
          stroke-width="0.5"
          data-v-2be30919=""
        ></path>
      </pattern>
    </defs>

    <g :transform="`translate(${canvasOffset[0]}, ${canvasOffset[1]})`">
      <rect
        width="100%"
        height="100%"
        fill="url(#grid)"
        transform="translate(0, 0)"
        data-v-2be30919=""
      ></rect>
      <g transform="translate(8, 8)" stroke-width="1.5" stroke="#999" fill="transparent">
        <path v-for="pair in ioPairs" :d="curve(pair)" />
      </g>
    </g>
  </svg>
</template>
