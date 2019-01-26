const parseColor = require('./parseColor')
const parseOperation = require('./parseOperation')

function parse(str) {
  const {blendMode, bg, fg} = parseOperation(str.split(' '))
  return {
    blendMode,
    bg: parseColor(bg),
    fg: parseColor(fg),
  }
}

module.exports = parse
