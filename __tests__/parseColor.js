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

describe('parse fractional RGB colors', () => {
  test.each([
    ['0.27,0.54,0.72', {rgb: [0.27, 0.54, 0.72], scale: 1}],
    ['1.0,1,1', {rgb: [1.0, 1.0, 1.0], scale: 1}],
    ['1.0,0,0', {rgb: [1.0, 0, 0], scale: 1}],
  ])(
    'parses correctly decimal RGB %s',
    expectParseColor)

  test.each([
    ['0,0,1', {rgb: [0, 0, 1]}],
    ['1,0,1', {rgb: [1, 0, 1]}],
    ['1,1,1', {rgb: [1, 1, 1]}],
  ])(
    'parses unit integer RGB %s as decimal',
    expectParseColor)

  test.each(['1.0,1.0', '1.0,0.9,0.8,0.7', '0.6'])(
    'parser rejects incorrect-sized fractional RGB %s',
    expectThrowOnParseColor)

  test.each(['255.0,1,1', '-1.0,0,0', '0,0.0,1000'])(
    'parser rejects out-of-bounds decimal RGB %s',
    expectThrowOnParseColor)
})

describe('parse decimal RGBA colors', () => {
  test.each([
    ['rgba:255,217,18,255', {rgba: [255, 217, 18, 255]}],
    ['argb:37,0,0,0', {rgba: [0, 0, 0, 37]}],
  ])(
    'parses correctly decimal %s',
    expectParseColor)

})

describe('parse fractional RGBA colors', () => {
  test.each([
    ['rgba:0.7,0.7,0.4,0.9', {rgba: [0.7, 0.7, 0.4, 0.9], scale: 1}],
    ['argb:0.37,0,0,0', {rgba: [0, 0, 0, 0.37], scale: 1}],
  ])(
    'parses correctly fractional %s',
    expectParseColor)

})

test('parser rejects empty color', () => {
  expect(() => parseColor('')).toThrow()
})
