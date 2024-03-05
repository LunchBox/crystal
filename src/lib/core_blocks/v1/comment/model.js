import Block from '@/models/block.js'

export default class Comment extends Block {
  constructor() {
    super()
    this.title = 'Comment'
    this.type = 'core_blocks/v1/comment'
    this.runnable = false
  }

  toCode() {
    return ['"""', this.code, '"""'].join('\r\n')
  }
}
