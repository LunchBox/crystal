import Block from '@/models/block.js'
import BlockInput from '@/models/block_input.js'

export default class extends Block {
  constructor() {
    super()
    this.title = 'Inspector'
    this.type = 'core_blocks/inspector'
    this.runnable = false

    this.inputs = [new BlockInput({ label: 'msg' })]
  }

  toCode() {
    return null
  }
}
