import Block from '@/models/block.js'

export default class extends Block {
  constructor() {
    super()
    this.title = 'Input'

    // not allow to change I/O
    this.noInputs = true
    this.noContent = true

    this.type = 'core_blocks/input'
    this.runnable = true
  }

  // fFunc() {
  //   if (!this.func) return 'None'

  //   let inputs = []
  //   if (this.namedArgs) {
  //     const sInputs = this.inputs.filter((inp) => inp.source !== null && inp.source !== undefined)
  //     inputs = sInputs.map((inp) => `${inp.label} = ${inp.source}`)
  //   } else {
  //     inputs = this.inputs.map((inp) => (inp.source ? inp.source : 'None'))
  //   }
  //   return `${this.func}(${inputs.join(', ')})`
  // }

  toCode() {
    // if (this.inputs.length === 0 && this.outputs.length === 0) {
    //   return this.code
    // }

    // const funcStr = this.fFunc()
    // if (this.outputs.length === 0) {
    //   return funcStr
    // }

    const outputs = this.outputs.map((output) => {
      let exp = 'None'
      if (output.type === 'res') {
        // do nothing, there will not allow to exec
      } else {
        exp = this.fVal(output)
      }
      return `locals()['${this.id}_${output.id}'] = ${exp}`
    })
    return outputs.join('\r\n')
  }

}
