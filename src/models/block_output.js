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

export default class BlockOutput extends Base {
  constructor({ label = 'res', type = 'res' } = {}) {
    super()
    console.log(label, type)
    this.label = label
    this.type = type
    this.defaultValue = null
    this.options = []
    this.value = null
  }
}
