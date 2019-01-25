const parseColor = require('../src/parser/parseColor')

const expectParseColor = (color, parsed) => {
  expect(parseColor(color)).toEqual(parsed)
}

const expectThrowOnParseColor = (color) => {
  expect(() => parseColor(color)).toThrow()
}

describe('parse hex RGB colors', () => {
  test.each([
    ['ffffff', {rgb: [0xff, 0xff, 0xff]}],
    ['00BC3D', {rgb: [0x00, 0xbc, 0x3d]}],
    ['000000', {rgb: [0x00, 0x00, 0x00]}],
    ['3Fb7cE', {rgb: [0x3f, 0xb7, 0xce]}]]
  )(
    'parses correctly hex color #%s',
    expectParseColor)

  test.each([['zzz'], ['fffc3']])(
    'parser rejects invalid color %s',
    expectThrowOnParseColor)
})

describe('parse hex RGBA colors', () => {
  test.each([
    ['argb:ffff0000', {rgba: [0xff, 0x00, 0x00, 0xff]}],
    ['rgba:00ccffcc', {rgba: [0x00, 0xcc, 0xff, 0xcc]}],
  ])(
    'parses correctly hex color %s',
    expectParseColor)
})

describe('parse decimal RGB colors', () => {
  test.each([
    ['255,217,18', {rgb: [255, 217, 18]}],
    ['0,0,0', {rgb: [0, 0, 0]}],
  ])(
    'parses correctly decimal RGB %s',
    expectParseColor)

  test.each(['255,37', '255,26,89,31', '0'])(
    'parser rejects incorrect-sized decimal RGB %s',
    expectThrowOnParseColor)

  test.each(['255,37,900', '255,-1,1', '0,0,1000'])(
    'parser rejects out-of-bounds decimal RGB %s',
    expectThrowOnParseColor)
})

test('parser rejects empty color', () => {
  expect(() => parseColor('')).toThrow()
})
