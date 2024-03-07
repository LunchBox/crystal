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
export const OUTPUT_TYPES = ['func_return', 'string', 'text', ...INPUT_TYPES, 'select']

import Base from './base.js'

export default class OutputConfig extends Base {
  constructor() {
    super()
    this.label = 'res'
    this.type = null
    this.defaultValue = null
    this.options = []
    this.value = null
  }
}
