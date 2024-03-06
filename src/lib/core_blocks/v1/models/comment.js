import Block from '@/models/block.js'

export default class Comment extends Block {
  constructor() {
    super()
    this.title = 'Comment'
    this.type = 'core_blocks/comment'
    this.runnable = false
  }

  toCode() {
    return ['"""', this.content, '"""'].join('\r\n')
  }
}
