import Base from './base.js'
import Block from './block.js'

import CoreBlocks from '@/lib/core_blocks/v1/models'

export default class Project extends Base {
  constructor() {
    super()
    this.title = 'Project Name'

    this.offset = [0, 0]
    this.scale = 1

    this.blocks = []
    this.blockGroups = []
  }

  afterLoad() {
    const convert = (attrs) => {
      const constructor = CoreBlocks[attrs.type] || Block
      const b = new constructor().load(attrs)
      if (Array.isArray(b.childBlocks)) {
        b.childBlocks = b.childBlocks.map(convert)
      }
      return b
    }

    this.blocks = this.blocks.map(convert)
  }
}
