import Block from '@/models/block.js'
import BlockInput from '@/models/block_input.js'
import BlockOutput from '@/models/block_output.js'

export default class extends Block {
  constructor() {
    super()
    this.title = 'Key-Value Select'

    const input = new BlockInput({ label: 'kvObj' })
    this.inputs = [ input ]

    const output = new BlockOutput({ label: 'res' })
    this.outputs = [ output ]

    // not allow to change I/O
    this.noInputs = true
    this.noOutputs = true

    this.type = 'core_blocks/kv_select'
    this.runnable = true
  }

  toCode() {
    const outputs = this.outputs.map((output) => {
      const exp = this.fVal(output)
      return `locals()['${this.id}_${output.id}'] = ${exp}`
    })

    return outputs.join("\n")
  }
}
