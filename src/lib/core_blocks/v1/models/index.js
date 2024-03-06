// 預設懶加載，eager: true 則是直接加載
const CoreBlocks = Object.fromEntries(
  Object.entries(import.meta.glob('./**/*.js', { eager: true })).map(([k, m]) => {
    const path = k.replace(/\.js$/, '').replace(/^\.\//, '')
    return [`core_blocks/${path}`, m.default]
  })
)

export default CoreBlocks
