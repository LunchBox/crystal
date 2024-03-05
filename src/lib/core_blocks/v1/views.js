// export { default as Comment } from './comment/BlockView.vue'
import { defineAsyncComponent } from 'vue'

export const ViewComponents = {
  'core_blocks/v1/comment': defineAsyncComponent(
    () => import(`@/lib/core_blocks/v1/comment/BlockView.vue`)
  )
}
