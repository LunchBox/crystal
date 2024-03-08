import { io } from 'socket.io-client'

import { useProjectStore } from '@/stores/project.js'

const store = useProjectStore()
const { assignMsgId, assignStatus, appendStd, assignDisplayData } = store

const URL = 'http://127.0.0.1:5000'

export const socket = io(URL)

socket.on('connect', () => {
  console.log('socket connected.')
})

socket.on('disconnect', () => {
  console.log('socket disconnected.')
})

socket.on('output', (msg) => {
  // console.log(msg)
  console.log(JSON.parse(msg))
  const msgObj = JSON.parse(msg)
  if (msgObj.msg_type === 'status') {
    assignStatus(msgObj?.parent_header?.msg_id, msgObj?.content?.execution_state)
  } else if (msgObj.msg_type === 'display_data') {
    assignDisplayData(msgObj?.parent_header?.msg_id, msgObj?.content?.data)
  } else if (msgObj.msg_type === 'stream') {
    const { name, text } = msgObj.content
    appendStd(msgObj.parent_header.msg_id, name, text)
  }
})

socket.on('reg_msg', (msg) => {
  const { msg_id, block_id } = JSON.parse(msg)
  assignMsgId(block_id, msg_id)
})

function run(block) {
  const code = block.toCode()
  block.resetOutputs()
  socket.emit('execute_input', JSON.stringify({ block_id: block.id, code }))
}

export { run }
