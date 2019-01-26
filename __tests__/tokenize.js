const { buildTree, parseToTree, tokenize } = require('../src/parser/tokenize')

test.each([
  ['rgba:ffffffcc', 'rgba:ffffffcc'],
  ['(rgba:ffffffcc)', 'rgba:ffffffcc'],
  ['((rgba:ffffffcc))', 'rgba:ffffffcc'],
  ['rgba:ffffffcc over 000000', {
    op: 'over',
    lhs: 'rgba:ffffffcc',
    rhs: '000000'
  }],
  ['(rgba:ffffffcc) over 000000', {
    op: 'over',
    lhs: 'rgba:ffffffcc',
    rhs: '000000'
  }],
  ['rgba:ffffffcc over (000000)', {
    op: 'over',
    lhs: 'rgba:ffffffcc',
    rhs: '000000'
  }],
  ['rgba:ffffffcc over (000000 over ffffff)', {
    op: 'over',
    lhs: 'rgba:ffffffcc',
    rhs: {
      op: 'over',
      lhs: '000000',
      rhs: 'ffffff'
    }
  }],
  ['(rgba:ffffffcc over 000000) over ffffff', {
    op: 'over',
    lhs: {
      op: 'over',
      lhs: 'rgba:ffffffcc',
      rhs: '000000'
    },
    rhs: 'ffffff'
  }],
  ['rgba:ffffffcc over 000000 over ffffff', {
    op: 'over',
    lhs: {
      op: 'over',
      lhs: 'rgba:ffffffcc',
      rhs: '000000'
    },
    rhs: 'ffffff'
  }],
])(
  'build syntax tree for color expression: %s',
  (expr, tree) => expect(parseToTree(expr)).toEqual(tree)
)

test.each([
  '(rgba:ffffffcc',
  'rgba:ffffffcc)',
  '((rgba:ffffffcc)',
  'rgba:ffffffcc over',
  '(rgba:ffffffcc over',
  '(rgba:ffffffcc over 000000',
])(
  'invalid color expression: %s',
  (expr) => expect(() => parseToTree(expr)).toThrow()
)
