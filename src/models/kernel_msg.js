const mixin = {
  appendStd(stdType, text) {
    this[stdType] === null ? (this[stdType] = text) : (this[stdType] += text)
  },

  dealWithKernelMessage(msgObj) {
    const { msg_type: msgType, content } = msgObj
    if (!content) return

    if (msgType === 'status') {
      this.status = content.execution_state
    } else if (msgType === 'display_data') {
      this.displayData = content.data
    } else if (msgType === 'stream') {
      const { name: stdType, text } = content
      this.appendStd(stdType, text)
    } else if (msgType === 'error') {
      const { ename, evalue, traceback } = msgObj.content
      const text = [`${ename}: ${evalue}`].join('\r\n')
      this.appendStd(msgObj.parent_header.msg_id, 'stderr', text)
    } else if (msgType === ' execute_result') {
      //TODO
    }
  }
}

export default mixin
