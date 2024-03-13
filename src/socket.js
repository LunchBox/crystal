import { io } from 'socket.io-client'
import { v4 as uuidv4 } from 'uuid'

const URL = 'http://127.0.0.1:5000'

export const socket = io(URL, { transports: ['websocket', 'polling', 'flashsocket'] })

socket.on('connect', () => {
  console.log('socket connected.')
})

socket.on('disconnect', () => {
  console.log('socket disconnected.')
})

const idMapping = {}
const observers = {}
function subscribe(exId, observer) {
  Array.isArray(observers[exId]) ? observers[exId].push(observer) : (observers[exId] = [observer])
}

function notify(exId, msgObj) {
  observers[exId]?.forEach((ob) => ob.dealWithKernelMessage(msgObj))
}

socket.on('output', (msg) => {
  const msgObj = JSON.parse(msg)
  console.log(msgObj)

  const msgId = msgObj?.parent_header?.msg_id
  const exchangeId = idMapping[msgId]

  notify(exchangeId, msgObj)
})

socket.on('reg_msg', (msg) => {
  const { msgId, exchangeId } = JSON.parse(msg)
  idMapping[msgId] = exchangeId

  observers[exchangeId].forEach((ob) => (ob.msgId = msgId))
})

function runCode(code, subscriber) {
  const exchangeId = uuidv4()
  subscribe(exchangeId, subscriber)

  const data = JSON.stringify({ exchangeId, code })
  socket.emit('execute_input', data)
}

async function runBlock(block) {
  return new Promise((resolve) => {
    const statusListener = (msg) => {
      const { msg_type: msgType, content } = JSON.parse(msg)
      if (msgType === 'status' && content.execution_state === 'idle') {
        socket.off('output', statusListener)
        resolve()
      }
    }

    socket.on('output', statusListener)

    const code = block.toCode()
    block.resetOutputs()
    runCode(code, block)
  })
}

export { runCode, runBlock }
