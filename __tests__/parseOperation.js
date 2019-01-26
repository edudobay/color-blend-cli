const parseOperation = require('../src/parser/parseOperation')

function args(str) {
  return str.split(' ')
}

test('parses correctly \'over\' operation between two hex colors', () => {
  expect(parseOperation(args('000000 over ffffff'))).toEqual({
    blendMode: 'normal',
    bg: 'ffffff',
    fg: '000000'
  })
})

test('parses correctly over operation with decimal rgb colors', () => {
  expect(parseOperation(args('255,255,0 over 0,0,0'))).toEqual({
    blendMode: 'normal',
    bg: '0,0,0',
    fg: '255,255,0'
  })
})

test('parser rejects incomplete \'over\' operation', () => {
  expect(() => {
    parseOperation(args('000000 over'))
  }).toThrow()
})

test('parser rejects invalid operation', () => {
  expect(() => {
    parseOperation(args('000000 sometimes ffffff'))
  }).toThrow()
})
