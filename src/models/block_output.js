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
export const OUTPUT_TYPES = ['res', 'string', 'text', ...INPUT_TYPES, 'select', 'stdout', 'stderr']

import Base from './base.js'

import { computed } from 'vue'

export default class BlockOutput extends Base {
  constructor({ label = 'res', type = 'res' } = {}) {
    super()

    this.label = label
    this.type = type
    this.defaultValue = null

    this.options = []

    this.value = null

    this._inputs = []
  }

}
