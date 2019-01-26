const parseColor = require('./parseColor')
const parseOperation = require('./parseOperation')

const { tokenize, buildTree } = require('./tokenize')

function parse(str) {
  const tokens = tokenize(str)

  const result = buildTree(tokens)

  return result

  //const {blendMode, bg, fg} = parseOperation(str.split(' '))
  return {
    blendMode,
    bg: parseColor(bg),
    fg: parseColor(fg),
  }
}

module.exports = parse
