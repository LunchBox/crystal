import { v4 as uuidv4 } from 'uuid'

const REPLACER = (key, value) => {
  return key.startsWith('_') || key.startsWith('$') ? undefined : value
}

const DOWN_CASE_LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('')

// const UP_CASE_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const NUMBERS = '0123456789'.split('')

const CHARS = [...DOWN_CASE_LETTERS, ...NUMBERS]

const KEY_LEN = 8

function randomItem(array) {
  const idx = Math.floor(Math.random() * array.length)
  return array[idx]
}

function randomId(keyLen = KEY_LEN) {
  return [
    randomItem(DOWN_CASE_LETTERS), // make sure it start from chars
    ...new Array(keyLen - 1).fill().map(() => randomItem(CHARS))
  ].join('')
}

export default class Base {
  constructor() {
    this.id = randomId()
  }

  resetID() {
    this.id = randomId()
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
