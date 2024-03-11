import Block from '@/models/block.js'

export default class extends Block {
  constructor() {
    super()
    this._title = null
    this.type = 'core_blocks/code'
    this.runnable = true
  }

  get title() {
    if (this._title !== null) return this._title
    if (this.content === null) return null
    return this.content.split('\n').shift()
  }

  set title(val) {
    this._title = val
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
    return this.content
  }
}
