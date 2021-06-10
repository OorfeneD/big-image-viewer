const { createPyramid, createTiles } = require('./index')

//TODO:
//Add automatic image generation before test
//Now test can run only on local machine with .images/in8.tif file
describe('Main functionality check', () => {
  test('createPyramid must return not false value', async () => {
    const result = await createPyramid('./.images/in8.tif', './.images/pyramids')
    expect(result).not.toBeFalsy()
  }, 3000)
  test('createTiles must return not false value', async () => {
    const result = await createTiles('./.images/in8.tif', './.images/tiles', tileSize=1024)
    expect(result).not.toBeFalsy()
  }, 30000)
})