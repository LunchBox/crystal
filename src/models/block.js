import Base from './base.js'
import BlockOutput from './block_output.js'

export default class Block extends Base {
  constructor() {
    super()
    this.title = 'Block Name'

    this.inputs = []
    this.outputs = []

    this.position = [0, 0]

    this.values = {}

    this.func = null
    this.namedArgs = false

    this.code = null

    this.seq = 0

    // the message id of kernel
    this.msgId = null
    this.status = 'idle'
    this.stdout = null
  }

  get msgIdx() {
    if (!this.msgId) return '*'

    return this.msgId.split('_').reverse()[0]
  }

  afterLoad() {
    this.outputs = this.outputs.map((attr) => {
      return new BlockOutput().load(attr)
    })
  }

  setArg(inputId, block, output) {
    const input = this.inputs.find((inp) => inp.id === inputId)
    input.source = [block.id, output.id].join('_')
    // this.argsMap[arg] = [block.id, outputLabel].join('_')
  }

  delInput(idx) {
    this.inputs.splice(idx, 1)
  }

  delOutput(idx) {
    this.outputs.splice(idx, 1)
  }

  delOutputOption(outputIdx, optIdx) {
    this.outputs[outputIdx].options.splice(optIdx, 1)
  }

  fVal(output) {
    const val = this.values[output.label]
    if (output.type === 'number') {
      return `${val ? val : 0}`
    } else {
      return `'${val ? val : ''}'`
    }
  }

  fFunc() {
    if (!this.func) return 'None'

    let inputs = []
    if (this.namedArgs) {
      const sInputs = this.inputs.filter((inp) => inp.source !== null && inp.source !== undefined)
      inputs = sInputs.map((inp) => `${inp.label} = ${inp.source}`)
    } else {
      inputs = this.inputs.map((inp) => (inp.source ? inp.source : 'None'))
    }
    return `${this.func}(${inputs.join(', ')})`
  }

  toCode() {
    const funcStr = this.fFunc()
    if (this.outputs.length === 0) {
      return funcStr
    }

    const outputs = this.outputs.map((output) => {
      let exp = 'None'
      if (output.type === 'func_return') {
        exp = funcStr
      } else {
        exp = this.fVal(output)
      }
      return `locals()['${this.id}_${output.id}'] = ${exp}`
    })
    return outputs.join('\r\n')
  }
}
