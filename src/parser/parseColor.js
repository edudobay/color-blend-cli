function parseHexLiteral(numBytes) {

}

function parseColor(color) {
  if (color.startsWith('rgba:')) {
    if (/^rgba:[0-9a-fA-F]{8}$/.test(color)) {
      const components = [0, 1, 2, 3].map(i => parseInt(color.substr(5 + 2*i, 2), 16))
      return {rgba: components}
    }
  }

  if (color.startsWith('argb:')) {
    if (/^argb:[0-9a-fA-F]{8}$/.test(color)) {
      const components = [1, 2, 3, 0].map(i => parseInt(color.substr(5 + 2*i, 2), 16))
      return {rgba: components}
    }
  }

  if (/^[0-9a-fA-F]{6}$/.test(color)) {
    const components = [0, 1, 2].map(i => parseInt(color.substr(2*i, 2), 16))
    return {rgb: components}
  }

  throw new Error('invalid color literal')
}

module.exports = parseColor
