export const INPUT_TYPES = [
  'button',
  'checkbox',
  'color',
  'date',
  'datetime-local',
  'email',
  'file',
  'hidden',
  'image',
  'month',
  'number',
  'password',
  'radio',
  'range',
  'reset',
  'search',
  'submit',
  'tel',
  // 'text', // replace with string
  'time',
  'url',
  'week'
]

// basiclly the HTML input type
export const OUTPUT_TYPES = ['res', 'string', 'text', ...INPUT_TYPES, 'select']

import Base from './base.js'

export default class OutputConfig extends Base {
  constructor() {
    super()
    this.labelName = null
    this.type = null
    this.defaultValue = null
    this.options = []
    this.value = null
  }

  get label() {
    if (this.labelName === null) return this.type
    return this.labelName
  }

  set label(val) {
    this.labelName = val
  }
}
