function range(n) {
  return [...Array(n).keys()]
}

const hexLiteralPatterns = {}
const decimalLiteralPattern = /^[0-9]+$/
const fractionalLiteralPattern = /^([01]?\.)?[0-9]+$/

function patternForHexLiteral(numBytes) {
  if (!(numBytes in hexLiteralPatterns)) {
    const expectedLength = numBytes * 2
    hexLiteralPatterns[numBytes] = new RegExp(`^[0-9a-fA-F]{${expectedLength}}$`)
  }

  return hexLiteralPatterns[numBytes]
}

function isHexLiteral(literal, numBytes) {
  return patternForHexLiteral(numBytes).test(literal)
}

function isDecimalLiteral(literal, numBytes) {
  const components = literal.split(',')
  return components.length === numBytes
    && components.every(c => decimalLiteralPattern.test(c))
    && components.map(c => parseInt(c, 10)).every(c => c >= 0 && c <= 255)
}

function isFractionalLiteral(literal, numBytes) {
  const components = literal.split(',')
  return components.length === numBytes
    && components.every(c => fractionalLiteralPattern.test(c))
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

function colorValue(colorModel, {value, scale = null}) {
  const result = {[colorModel]: value}
  if (scale != null) {
    result['scale'] = scale
  }
  return result
}

function parseColor(color) {
  if (color.startsWith('rgba:')) {
    return colorValue('rgba', parseColorValue(color.substr(5), 4))
  }

  if (color.startsWith('argb:')) {
    return colorValue('rgba', parseColorValue(color.substr(5), 4, [1, 2, 3, 0]))
  }

  return colorValue('rgb', parseColorValue(color, 3))
}

module.exports = parseColor
