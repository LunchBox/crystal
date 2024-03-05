import Base from './base.js'
import Block from './block.js'

import { BlockModels } from '@/lib/core_blocks/v1/models.js'

export default class Project extends Base {
  constructor() {
    super()
    this.title = 'Project Name'

    this.blocks = []
    this.blockGroups = []
  }

  afterLoad() {
    this.blocks = this.blocks.map((obj) => {
      const constructor = BlockModels[obj.type] || Block
      return new constructor().load(obj)
    })
  }
}
