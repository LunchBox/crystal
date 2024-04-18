import Block from '@/models/block.js'

export default class extends Block {
  constructor() {
    super()
    this.type = 'core_blocks/func'
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

  execStr() {
    if (!this.content) return 'None'

    let inputs = []
    if (this.namedArgs) {
      const sInputs = this.inputs.filter((inp) => inp.source !== null && inp.source !== undefined)
      inputs = sInputs.map((inp) => `${inp.label} = ${inp.source}`)
    } else {
      inputs = this.inputs.map((inp) => (inp.source ? inp.source : 'None'))
    }
    return `${this.id}(${inputs.join(', ')})`
  }

  toCode() {
    const codes = []

    // func defination
    const fName = this.id
    const argNames = this.inputs.map(inp => inp.label).join(', ')
    codes.push(`def ${fName}(${argNames}):`)

    // replace all tab with space, then indent 1 more layer for cutomize function name
    // might not work with code that using 4 spaces as a indent
    const fCode = this.content.replace(/^\t/gm, "  ").split("\n").map(line => '  ' + line).join("\n")
    codes.push(fCode)

    const execStr = this.execStr()

    // 沒有輸出就只需要運行 function 即可
    if (this.outputs.length === 0) {
      codes.push(execStr)
      return codes.join("\n")
    }

    // 有輸出，要把結果掛到輸出上
    const outputs = this.outputs.map((output) => {
      let exp = 'None'
      if (output.type === 'res') {
        exp = execStr
      } else {
        exp = this.fVal(output)
      }
      return `locals()['${this.id}_${output.id}'] = ${exp}`
    })

    const code = [...codes, ...outputs].join("\n")
    // console.log(code)
    return code
  }
}
