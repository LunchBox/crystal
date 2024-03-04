<script setup>
import { storeToRefs } from 'pinia'
import { useProjectStore } from '@/stores/project.js'

const store = useProjectStore()
const { elPositions, canvasOffset, canvasScale, ioPairs } = storeToRefs(store)

console.log(canvasScale.value)

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
    <g :transform="`translate(${canvasOffset[0]}, ${canvasOffset[1]}) scale(${canvasScale}) `">
      <rect
        width="100%"
        height="100%"
        fill="transparent"
        stroke="#ccc"
        transform="translate(0, 0)"
      ></rect>
      <g transform="translate(8, 8)" stroke-width="1.5" stroke="#999" fill="transparent">
        <path v-for="pair in ioPairs" :d="curve(pair)" />
      </g>
    </g>
  </svg>
</template>
