// 預設懶加載，eager: true 則是直接加載
const models = import.meta.glob('./**/model.js', { eager: true })
console.log(models)

const CoreBlocks = {}
Object.entries(models).forEach(([k, m]) => {
  const path = k.replace('/model.js', '').replace('./', '')
  CoreBlocks[`core_blocks/${path}`] = m.default
})

export default CoreBlocks
