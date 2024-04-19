import Block from '@/models/block.js'

export default class extends Block {
  constructor() {
    super()

    this.title = 'Code Block'

    this.noInputs = true
    this.noOutputs = true

    this.type = 'core_blocks/code'
    this.runnable = true
  }

  toCode() {
    return this.content
    // let text = this.content
    // this.inputs.forEach((inp) => {
    //   if (!inp.source) return
    //   console.log(inp.source)
    //   const exp = new RegExp('\\${' + inp.label + '}', 'g')
    //   text = text.replace(exp, inp.source)
    // })
    // return text
  }
}
