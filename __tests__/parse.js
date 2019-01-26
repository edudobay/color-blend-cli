const parse = require('../src/parser/parse')

describe('integrated operation and color parser', () => {
  test.each([
    ['argb:cc000000 over ffffff', {
      blendMode: 'normal',
      bg: {rgb: [0xff, 0xff, 0xff]},
      fg: {rgba: [0, 0, 0, 0xcc]}
    }],
    ['argb:255,0,0,255 over rgba:555555cc', {
      blendMode: 'normal',
      bg: {rgba: [0x55, 0x55, 0x55, 0xcc]},
      fg: {rgba: [0, 0, 255, 255]}
    }],
  ])(
    'parses correctly over operation with mixed color literals',
    (text, parsed) => expect(parse(text)).toEqual(parsed)
  )
})
