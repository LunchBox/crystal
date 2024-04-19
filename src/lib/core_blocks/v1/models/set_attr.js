import Block from '@/models/block.js'
import BlockInput from '@/models/block_input.js'
import BlockOutput from '@/models/block_output.js'

export default class extends Block {
  constructor() {
    super()

    this.title = 'setattr'

    this.inputs = [
      new BlockInput({ label: 'obj' }),
      new BlockInput({ label: 'attr' }),
      new BlockInput({ label: 'val' }),
    ]

    // not allow to change I/O
    this.noInputs = true
    this.noOutputs = true

    this.hardcode = true

    this.type = 'core_blocks/set_attr'
    this.runnable = true
  }

  toCode() {
    const [obj, attr, val] = this.inputs
    const exp = `setattr(${obj.source}, ${attr.source}, ${val.source})`
    return exp
  }
}
