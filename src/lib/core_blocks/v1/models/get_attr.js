import Block from '@/models/block.js'
import BlockInput from '@/models/block_input.js'
import BlockOutput from '@/models/block_output.js'

export default class extends Block {
  constructor() {
    super()

    this.title = 'getattr'

    this.inputs = [
      new BlockInput({ label: 'obj' }),
      new BlockInput({ label: 'attr' }),
    ]

    this.outputs = [
      new BlockOutput({ label: 'res' }),
    ]

    // not allow to change I/O
    this.noInputs = true
    this.noOutputs = true

    this.hardcode = true

    this.type = 'core_blocks/get_attr'
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
    const exp = `getattr(${this.inputs[0].source}, ${this.inputs[1].source})`
    return `locals()['${this.id}_${this.outputs[0].id}'] = ${exp}`
  }
}
