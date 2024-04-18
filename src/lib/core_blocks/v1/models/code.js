import Block from '@/models/block.js'

export default class extends Block {
  constructor() {
    super()

    this.noInputs = true
    this.noOutputs = true

    this.type = 'core_blocks/code'
    this.runnable = true
  }

  dealWith(msgType, content) {
    super.dealWith(msgType, content)

    if (msgType === 'execute_result') {
      console.log('deal with: ')
      console.log(content)
      const text = content.data['text/plain']
      const info = JSON.parse(eval(text))
      console.log(info)
    }
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
