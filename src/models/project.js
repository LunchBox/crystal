import Base from './base.js'
import Block from './block.js'

import CoreBlocks from '@/lib/core_blocks/v1/models'

export default class Project extends Base {
  constructor() {
    super()
    this.title = 'Project Name'

    this.blocks = []
    this.blockGroups = []
  }

  afterLoad() {
    this.blocks = this.blocks.map((obj) => {
      const constructor = CoreBlocks[obj.type] || Block
      return new constructor().load(obj)
    })
  }
}
