import { v4 as uuidv4 } from 'uuid'

const REPLACER = (key, value) => {
  return key.startsWith('_') || key.startsWith('$') ? undefined : value
}

export default class Base {
  constructor() {
    this.id = uuidv4()
  }

  // clone without id
  clone() {
    const { id, ...attrs } = JSON.parse(this.dump())
    return new this.constructor().load(attrs)
  }

  load(data) {
    if (typeof data === 'string') {
      data = JSON.parse(data)
    }

    Object.assign(this, data)

    this.afterLoad()

    return this
  }

  afterLoad() {}

  dump() {
    this.constructor_name = this.constructor.name
    return JSON.stringify(this, REPLACER)
  }
}
