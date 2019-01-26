function parseOperation(args) {
  if (args.length !== 3) {
    throw new Error('invalid argument')
  }

  const [lhs, operator, rhs] = args
  if (operator !== 'over') {
    throw new Error('invalid operator')
  }

  return {
    blendMode: 'normal',
    bg: rhs,
    fg: lhs,
  }
}

module.exports = parseOperation
