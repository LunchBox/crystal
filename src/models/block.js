import Base from './base.js'
import BlockOutput from './block_output.js'

export default class Block extends Base {
  constructor() {
    super()
    this.title = 'Block Name'

    // this.args = ['arg0', 'arg1']
    // this.argsMap = {}

    this.inputs = []
    this.outputs = []

    this.position = [0, 0]

    this.values = {}

    this.func = null
    this.code = null

    this.seq = 0
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
    this.args.splice(idx, 1)
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
    if (!this.func) return ''

    const sInputs = this.inputs.filter((inp) => inp.source !== null && inp.source !== undefined)
    const inputs = sInputs.map((inp) => `${inp.label} = ${inp.source}`)
    return `${this.func}(${inputs.join(', ')})`
  }

  toCode() {
    if (this.args.length === 0) {
      return this.outputs
        .map((output) => {
          return `locals()['${this.id}_${output.id}'] = ${this.fVal(output)}`
        })
        .join('\r\n')
    } else {
      return this.fFunc()
    }
  }
}
