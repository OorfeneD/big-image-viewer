const { createPyramid, createTiles, proceedImage } = require('./index')

// TODO:
// Add automatic image generation before test
// Now test can run only on local machine with .images/in8.tif file

describe('Extra: base functionality', () => {
  test('createPyramid must return not false value', async () => {
    const result = await createPyramid('./.images/in8.tif', './.images/pyramids')
    expect(result).not.toBeFalsy()
  }, 3000)
  test('createTiles must return not false value', async () => {
    const result = await createTiles('./.images/in8.tif', './.images/tiles', 1024)
    expect(result).not.toBeFalsy()
  }, 30000)
})

describe('Main: Bad parameters', () => {
  test('createTiles must return error when parameters are empty', async () => {
    return expect(() => createTiles(null, null)).rejects.toMatchObject(new Error('Parameters must be not empty'))
  })
  test('createTiles must return error when parameters are not a string', async () => {
    return expect(() => createTiles([], '.images/tiles')).rejects.toMatchObject(new Error('Parameters must be are string'))
  })
  test('createTiles must return error when image is not exist', async () => {
    return expect(() => createTiles('not-exist.tif', '.images/tiles')).rejects.toMatchObject(new Error('Image file not found'))
  })
  test('createTiles must return error when directory invalid', async () => {
    return expect(() => createTiles('.images/in8.tif', 'invalid-directory*')).rejects.toMatchObject(new Error('Invalid out directory'))
  })
  test('createPyramid must return error when parameters are empty', async () => {
    return expect(() => createPyramid(null, null)).rejects.toMatchObject(new Error('Parameters must be not empty'))
  })
  test('createPyramid must return error when parameters are not a string', async () => {
    return expect(() => createPyramid([], '.images/pyramids')).rejects.toMatchObject(new Error('Parameters must be are string'))
  })
  test('createPyramid must return error when image is not exist', async () => {
    return expect(() => createPyramid('not-exist.tif', '.images/pyramids')).rejects.toMatchObject(new Error('Image file not found'))
  })
  test('createPyramid must return error when directory invalid', async () => {
    return expect(() => createPyramid('.images/in8.tif', 'invalid-directory*')).rejects.toMatchObject(new Error('Invalid out directory'))
  })
  test('proceedImage must return error when parameters are empty', async () => {
    return expect(() => proceedImage(null, null)).rejects.toMatchObject(new Error('Parameters must be not empty'))
  })
  test('proceedImage must return error when parameters are not a string', async () => {
    return expect(() => proceedImage([], '.images/pyramids')).rejects.toMatchObject(new Error('Parameters must be are string'))
  })
  test('proceedImage must return error when image is not exist', async () => {
    return expect(() => proceedImage('not-exist.tif', '.images/pyramids')).rejects.toMatchObject(new Error('Image file not found'))
  })
  test('proceedImage must return error when directory invalid', async () => {
    return expect(() => proceedImage('.images/in8.tif', 'invalid-directory*')).rejects.toMatchObject(new Error('Invalid out directory'))
  })
})
