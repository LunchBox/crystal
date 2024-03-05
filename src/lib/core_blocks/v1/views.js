import { defineAsyncComponent } from 'vue'

const ViewComponents = {
  'core_blocks/v1/comment': defineAsyncComponent(
    () => import(`@/lib/core_blocks/v1/comment/BlockView.vue`)
  ),
  'core_blocks/v1/func_mapping': defineAsyncComponent(
    () => import(`@/lib/core_blocks/v1/func_mapping/BlockView.vue`)
  )
}

export default ViewComponents
