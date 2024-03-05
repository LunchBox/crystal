import { defineAsyncComponent } from 'vue'

const ViewComponents = {
  'core_blocks/comment': defineAsyncComponent(() => import(`./comment/BlockView.vue`)),
  'core_blocks/func_mapping': defineAsyncComponent(() => import(`./func_mapping/BlockView.vue`))
}

export default ViewComponents
