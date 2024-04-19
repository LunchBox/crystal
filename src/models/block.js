import Base from './base.js'
import BlockInput from './block_input.js'
import BlockOutput from './block_output.js'

import mixin from './kernel_msg.js'

export default class Block extends Base {
  kernelEventListeners = {}

  constructor() {
    super()
    this.title = 'Block Name'

    this.width = 'auto'
    this.height = 'auto'

    this.type = 'block'

    this.inputs = []
    this.outputs = []

    this.position = [100, 100]

    // this.func = null
    this.namedArgs = false

    this.content = null
    this.runnable = true

    // this.code = null

    this.seq = 0

    // the message id of kernel
    this.msgId = null

    this.status = 'idle'
    this.stdout = null
    this.stderr = null
    this.displayData = null

    this.childBlocks = []
  }

  get msgIdx() {
    if (!this.msgId) return '*'

    return this.msgId.split('_').reverse()[0]
  }

  get hasInlineImage() {
    return this.displayData && this.displayData['image/png']
  }

  get inlineImageCaption() {
    if (!this.hasInlineImage) return null
    return this.displayData['text/plain']
  }

  get inlineImage() {
    if (!this.hasInlineImage) return null
    return `data:image/png;base64, ${this.displayData['image/png']}`
  }

  afterLoad() {
    this.outputs = this.outputs.map((attr) => {
      return new BlockOutput().load(attr)
    })
  }

  updateSize(w, h) {
    this.width = w
    this.height = h
  }

  addInput(label = 'arg') {
    this.inputs.push(new BlockInput({ label }))
  }

  setInput(inputId, block, output) {
    const input = this.inputs.find((inp) => inp.id === inputId)
    input.source = [block.id, output.id].join('_')
  }

  delInput(idx) {
    this.inputs.splice(idx, 1)
  }

  addOutput(label = 'res') {
    this.outputs.push(new BlockOutput({ label }))
  }

  delOutput(idx) {
    this.outputs.splice(idx, 1)
  }

  // TODO: should not be that simple
  setOutputValue(label, val) {
    const output = this.outputs.find((out) => out.label === label)
    output.value = val
  }

  delOutputOption(outputIdx, optIdx) {
    this.outputs[outputIdx].options.splice(optIdx, 1)
  }

  resetOutputs() {
    const list = ['res']
    this.outputs.filter((out) => list.includes(out.type)).forEach((out) => (out.value = null))
    this.stderr = null
    this.stdout = null
  }

  fVal(output) {
    const val = output.value
    if (output.type === 'number') {
      return `${val ? val : 0}`
    } else {
      return `'${val ? val : ''}'`
    }
  }

  // fFunc() {
  //   if (!this.func) return 'None'

  //   let inputs = []
  //   if (this.namedArgs) {
  //     const sInputs = this.inputs.filter((inp) => inp.source !== null && inp.source !== undefined)
  //     inputs = sInputs.map((inp) => `${inp.label} = ${inp.source}`)
  //   } else {
  //     inputs = this.inputs.map((inp) => (inp.source ? inp.source : 'None'))
  //   }
  //   return `${this.func}(${inputs.join(', ')})`
  // }

  toCode() {
    return 'None'

    // if (this.inputs.length === 0 && this.outputs.length === 0) {
    //   return this.code
    // }

    // const funcStr = this.fFunc()
    // if (this.outputs.length === 0) {
    //   return funcStr
    // }

    // const outputs = this.outputs.map((output) => {
    //   let exp = 'None'
    //   if (output.type === 'res') {
    //     exp = funcStr
    //   } else {
    //     exp = this.fVal(output)
    //   }
    //   return `locals()['${this.id}_${output.id}'] = ${exp}`
    // })
    // return outputs.join('\r\n')
  }
}

Object.assign(Block.prototype, mixin)
