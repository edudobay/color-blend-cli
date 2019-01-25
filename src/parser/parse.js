const parseColor = require('./parseColor')
const parseOperation = require('./parseOperation')

function parse(str) {
  const {bg, fg} = parseOperation(str.split(' '))
  return {bg: parseColor(bg), fg: parseColor(fg)}
}

module.exports = parse