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
export const OUTPUT_TYPES = ['string', 'text', ...INPUT_TYPES, 'select']

export default class OutputConfig {
  constructor() {
    this.name = 'res'
    this.type = null
    this.defaultValue = null
    this.options = []
  }
}
