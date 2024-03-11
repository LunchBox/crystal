import Block from '@/models/block.js'

export default class extends Block {
  constructor() {
    super()
    this.title = 'function map'
    this.type = 'core_blocks/func_mapping'
    this.runnable = true
  }

  funcStr() {
    if (!this.content) return 'None'

    let inputs = []
    if (this.namedArgs) {
      const sInputs = this.inputs.filter((inp) => inp.source !== null && inp.source !== undefined)
      inputs = sInputs.map((inp) => `${inp.label} = ${inp.source}`)
    } else {
      inputs = this.inputs.map((inp) => (inp.source ? inp.source : 'None'))
    }
    return `${this.content}(${inputs.join(', ')})`
  }

  toCode() {
    const funcStr = this.funcStr()

    // 沒有輸出就只需要運行 function 即可
    if (this.outputs.length === 0) {
      return funcStr
    }

    // 有輸出，要把結果掛到輸出上
    const outputs = this.outputs.map((output) => {
      let exp = 'None'
      if (output.type === 'res') {
        exp = funcStr
      } else {
        exp = this.fVal(output)
      }
      return `locals()['${this.id}_${output.id}'] = ${exp}`
    })
    return outputs.join('\r\n')
  }
}
