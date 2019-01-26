function formatHex(components) {
  return components.map(i => i.toString(16).padStart(2, '0')).join('')
}

function formatDecimal(components) {
  return components.map(i => i.toString()).join(',')
}

const replaceUnitPattern = /^1$/

function formatFractional(components) {
  return components.map(i => i.toString().replace(replaceUnitPattern, '1.0')).join(',')
}

module.exports = { formatHex, formatDecimal, formatFractional }
