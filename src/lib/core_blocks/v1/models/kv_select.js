import Block from '@/models/block.js'
import BlockInput from '@/models/block_input.js'
import BlockOutput from '@/models/block_output.js'

export default class extends Block {
  constructor() {
    super()
    this.title = 'Key-Value Select'

    const input = new BlockInput({ label: 'kvObj' })
    this.inputs = [ input ]

    const output = new BlockOutput({ label: 'res', type: 'select' })
    this.outputs = [ output ]

    // not allow to change I/O
    this.noInputs = true
    this.noOutputs = true

    this.type = 'core_blocks/kv_select'
    this.runnable = true
  }

  // watch inputs

}
