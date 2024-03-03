import Base from './base.js'
import Block from './block.js'

export default class Project extends Base {
  constructor() {
    super()
    this.title = 'Project Name'

    this.blocks = []
    this.blockGroups = []
  }

  afterLoad() {
    this.blocks = this.blocks.map((obj) => {
      return new Block().load(obj)
    })
  }
}
