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

  dealWith(msgType, content) {
    super.dealWith(msgType, content)

    if (msgType === 'execute_result') {
      console.log('deal with: ')
      console.log(content)
      const text = content.data['text/plain']
      const info = JSON.parse(eval(text))
      console.log(info)
    }
  }

  toCode() {
    const [obj, attr, val] = this.inputs
    const exp = `setattr(${obj.source}, ${attr.source}, ${val.source})`
    return exp
  }
}
