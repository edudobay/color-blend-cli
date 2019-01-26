const { formatHex, formatDecimal, formatFractional } = require('../src/formatter')

describe('format RGB as hex', () => {
  test.each([
    ['ffffff', [0xff, 0xff, 0xff]],
    ['555555cc', [0x55, 0x55, 0x55, 0xcc]],
  ])(
    'formats to #%s as expected',
    (text, components) => expect(formatHex(components)).toEqual(text)
  )
})

describe('format RGB as decimal', () => {
  test.each([
    ['255,255,0', [255, 255, 0]],
    ['0,127,0,37', [0, 127, 0, 37]],
  ])(
    'formats to %s as expected',
    (text, components) => expect(formatDecimal(components)).toEqual(text)
  )
})

describe('format RGB as fractional', () => {
  test.each([
    ['0.37,0.5,0.5', [0.37, 0.5, 0.5]],
    ['0,0.1,1.0,0.05', [0, 0.1, 1.0, 0.05]],
  ])(
    'formats to %s as expected',
    (text, components) => expect(formatFractional(components)).toEqual(text)
  )
})
