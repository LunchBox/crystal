import Base from './base.js'

export default class InputConfig extends Base {
  constructor({ label = 'arg' } = {}) {
    super()
    this.label = label
    this.source = null  // the source block & output label: ${block.id}_${outptu.id}

    this._sourceObj = null
  }

  setSource(block, output) {
    this.source = [block.id, output.id].join('_')
    this._sourceObj = output
  }
}
