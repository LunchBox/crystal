import Base from './base.js'

export default class InputConfig extends Base {
  constructor({ label = 'arg' } = {}) {
    super()
    this.label = label
    this.source = null
  }
}
