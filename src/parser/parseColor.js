function range(n) {
  return [...Array(n).keys()]
}

function parseHexLiteral(literal, numBytes, order = null) {
  const expectedLength = numBytes * 2
  const re = new RegExp(`^[0-9a-fA-F]{${expectedLength}}$`)

  if (!re.test(literal)) {
    throw new Error(`invalid hex literal for length ${numBytes}`)
  }

  return (order ? order : range(numBytes)).map(i =>
    parseInt(literal.substr(2 * i, 2), 16)
  )
}

function parseColor(color) {
  if (color.startsWith('rgba:')) {
    return {rgba: parseHexLiteral(color.substr(5), 4)}
  }

  if (color.startsWith('argb:')) {
    return {rgba: parseHexLiteral(color.substr(5), 4, [1, 2, 3, 0])}
  }

  return {rgb: parseHexLiteral(color, 3)}
}

module.exports = parseColor
