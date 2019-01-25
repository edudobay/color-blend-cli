function parseColor(color) {
  if (/[0-9a-fA-F]{6}/.test(color)) {
    const components = [0, 1, 2].map(i => parseInt(color.substr(2*i, 2), 16))
    return {rgb: components}
  }

  throw new Error('invalid color literal')
}

module.exports = parseColor
