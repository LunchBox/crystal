import Base from './base.js'

export default class Block extends Base {
  constructor() {
    super()
    this.title = 'Block Name'
    this.args = ['arg0', 'arg1']
    this.outputs = ['output']

    this.position = [0, 0]

    this.options = {}

    this.code = null
  }
}
