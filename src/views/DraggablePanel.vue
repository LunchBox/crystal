<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps(['pos'])

defineEmits(['close'])

const panel = ref(null)
const dragging = ref(false)

const pos = reactive({ x: 100, y: 100 })
watch(
  props.pos,
  (val) => {
    if (!val) return
    Object.assign(pos, val)
  },
  { immediate: true }
)

const panelStyle = computed(() => {
  const { x, y } = pos
  return {
    left: `${x}px`,
    top: `${y}px`
  }
})

function mousemove(e) {
  if (dragging.value) {
    pos.x += e.movementX
    pos.y += e.movementY
  }
}

function mouseup() {
  dragging.value = false
}

onMounted(() => {
  document.addEventListener('mousemove', mousemove)
  window.addEventListener('mouseup', mouseup)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', mousemove)
  window.removeEventListener('mouseup', mouseup)
})
</script>

<template>
  <div class="panel" ref="pannel" :style="panelStyle">
    <div class="panel-header" @mousedown="dragging = true">
      <span class="close" title="Close Panel" @click.prevent="$emit('close')"></span>
      <span class="title">
        <slot name="header"></slot>
      </span>
    </div>
    <div class="panel-content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.panel {
  position: absolute;
  z-index: 20;
  background: #fff;
  box-shadow: 0 0 4px gray;
  padding: 0.25rem;
  min-width: 400px;
}
.panel-header {
  display: flex;
  align-items: center;
  gap: 0 0.25rem;
}
.panel-header .close {
  display: block;
  width: 1rem;
  height: 1rem;
  background: #ccc;
}
.panel-header .close:hover {
  background: orange;
}
.panel-header .title {
  background: #efefef;
  flex: 1;
  padding: 0 0.25rem;
  font-size: 0.75rem;
}

.panel-content {
  padding: 0.5rem;
}
</style>
