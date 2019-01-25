function range(n) {
  return [...Array(n).keys()]
}

function isHexLiteral(literal, numBytes) {
  const expectedLength = numBytes * 2
  const re = new RegExp(`^[0-9a-fA-F]{${expectedLength}}$`)

  return re.test(literal)
}

function isDecimalLiteral(literal, numBytes) {
  const components = literal.split(',')
  return components.length === numBytes
    && components.every(c => /[0-9]+/.test(c))
    && components.map(c => parseInt(c, 10)).every(c => c >= 0 && c <= 255)
}

function parseHexLiteral(literal, numBytes, order = null) {
  if (!isHexLiteral(literal, numBytes)) {
    throw new Error(`invalid hex literal for length ${numBytes}`)
  }

  return (order ? order : range(numBytes)).map(i =>
    parseInt(literal.substr(2 * i, 2), 16)
  )
}

function parseDecimalLiteral(literal, numBytes, order = null) {
  const components = literal.split(',').map(i => parseInt(i, 10))
  return (order ? order : range(numBytes)).map(i => components[i])
}

function parseColor(color) {
  if (color.startsWith('rgba:')) {
    return {rgba: parseHexLiteral(color.substr(5), 4)}
  }

  if (color.startsWith('argb:')) {
    return {rgba: parseHexLiteral(color.substr(5), 4, [1, 2, 3, 0])}
  }

  if (isHexLiteral(color, 3)) {
    return {rgb: parseHexLiteral(color, 3)}
  }

  if (isDecimalLiteral(color, 3)) {
    return {rgb: parseDecimalLiteral(color, 3)}
  }

  throw new Error('invalid color literal')
}

module.exports = parseColor
