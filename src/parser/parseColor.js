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
    && components.every(c => /^[0-9]+$/.test(c))
    && components.map(c => parseInt(c, 10)).every(c => c >= 0 && c <= 255)
}

function isFractionalLiteral(literal, numBytes) {
  const components = literal.split(',')
  return components.length === numBytes
    && components.every(c => /^([01]?\.)?[0-9]+$/.test(c))
    && components.map(c => parseFloat(c)).every(c => c >= 0 && c <= 1)
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

function parseFractionalLiteral(literal, numBytes, order = null) {
  const components = literal.split(',').map(i => parseFloat(i))
  return (order ? order : range(numBytes)).map(i => components[i])
}

function parseColorValue(value, numBytes, order) {
  if (isHexLiteral(value, numBytes)) {
    return {value: parseHexLiteral(value, numBytes, order)}
  }

  if (isDecimalLiteral(value, numBytes)) {
    return {value: parseDecimalLiteral(value, numBytes, order)}
  }

  if (isFractionalLiteral(value, numBytes)) {
    return {value: parseFractionalLiteral(value, numBytes, order), scale: 1}
  }

  throw new Error(`invalid color value for ${numBytes} components`)
}

function parseColor(color) {
  if (color.startsWith('rgba:')) {
    const {value, scale = 255} = parseColorValue(color.substr(5), 4)
    if (scale === 1) {
      return {rgbaf: value}
    }
    return {rgba: value}
  }

  if (color.startsWith('argb:')) {
    const {value, scale = 255} = parseColorValue(color.substr(5), 4, [1, 2, 3, 0])
    if (scale === 1) {
      return {rgbaf: value}
    }
    return {rgba: value}
  }

  const {value, scale = 255} = parseColorValue(color, 3)
  if (scale === 1) {
    return {rgbf: value}
  }
  return {rgb: value}
}

module.exports = parseColor
