const parseColor = require('../src/parser/parseColor')

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

test('parser rejects empty color', () => {
  expect(() => parseColor('')).toThrow()
})
