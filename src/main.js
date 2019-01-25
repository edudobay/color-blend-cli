const { normal } = require('color-blend')

const whiteBg = {r: 255, g: 255, b: 255, a: 1}
const fg = {r: 0, g: 0, b: 0, a: 0x13 / 255.0}

const result = normal(whiteBg, fg)

console.log(result)
