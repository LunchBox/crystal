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

    // 目前 server 上的執行結果都存在 server 上，並不會將內容 output 出來放在前端的 output 裡
    // 所以這裡的 value 主要是一些可以存在前端的數據
    // 或者一些前端的 input widget
    this.value = null

    this._inputs = []
  }

}
