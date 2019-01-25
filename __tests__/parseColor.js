const parseColor = require('../src/parser/parseColor')

describe('parse hex RGB colors', () => {
  test.each([
    ['ffffff', {rgb: [0xff, 0xff, 0xff]}],
    ['00BC3D', {rgb: [0x00, 0xbc, 0x3d]}],
    ['000000', {rgb: [0x00, 0x00, 0x00]}],
    ['3Fb7cE', {rgb: [0x3f, 0xb7, 0xce]}]]
  )(
    'parses correctly hex color #%s',
    (color, parsed) => {
      expect(parseColor(color)).toEqual(parsed)
    })

  test.each([['zzz'], ['fffc3']])(
    'parser rejects invalid color %s',
    (color) => {
      expect(() => parseColor(color)).toThrow()
    })
})

describe('parse hex RGBA colors', () => {
  test.each([
    ['argb:ffff0000', {rgba: [0xff, 0x00, 0x00, 0xff]}],
    ['rgba:00ccffcc', {rgba: [0x00, 0xcc, 0xff, 0xcc]}],
  ])(
    'parses correctly hex color %s',
    (color, parsed) => {
      expect(parseColor(color)).toEqual(parsed)
    })
})

test('parser rejects empty color', () => {
  expect(() => parseColor('')).toThrow()
})
