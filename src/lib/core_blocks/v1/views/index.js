import { defineAsyncComponent } from 'vue'

const views = Object.fromEntries(
  Object.entries(import.meta.glob('./**/*.vue')).map(([k, f]) => {
    const baseName = k.replace(/^\.\//, '').replace(/\.vue$/, '')
    return [`core_blocks/${baseName}`, defineAsyncComponent(f)]
  })
)
export default views
