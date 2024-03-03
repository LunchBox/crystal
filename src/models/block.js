import Base from './base.js'

export default class Block extends Base {
  constructor() {
    super()
    this.title = 'Block Name'
    this.args = ['arg0', 'arg1']
    this.argsMap = {}

    this.outputs = []

    this.position = [0, 0]

    this.values = {}

    this.code = null
  }

  setArg(arg, block, outputLabel) {
    this.argsMap[arg] = [block.id, outputLabel].join('_')
  }

  delArg(idx) {
    this.args.splice(idx, 1)
  }

  delOutput(idx) {
    this.outputs.splice(idx, 1)
  }

  delOutputOption(outputIdx, optIdx) {
    this.outputs[outputIdx].options.splice(optIdx, 1)
  }
}
