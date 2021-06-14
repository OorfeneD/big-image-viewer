const sharp = require('sharp')
const { join, basename, extname, dirname } = require('path')
const { mkdirSync, existsSync } = require('fs')
const IS_DEBUG = process.env.DEBUG || false

const createTiles = async (fileName, outFolder, tileSize = 512) => {
  if (!fileName || !outFolder) throw new Error('Parameters must be not empty')
  if (typeof fileName !== 'string' || typeof outFolder !== 'string') throw new Error('Parameters must be are string')
  if (!existsSync(fileName)) throw new Error('Image file not found')
  const imageName = basename(fileName, extname(fileName))
  const image = sharp(fileName, {
    limitInputPixels: false,
    pages: -1
  })
  const tilesOutFolder = join(outFolder)
  try {
    if (!existsSync(tilesOutFolder)) {
      mkdirSync(tilesOutFolder, {
        recursive: true
      })
    }
  } catch (error) {
    throw new Error('Invalid out directory')
  }
  const meta = await image.metadata()
  return new Promise((resolve, reject) => {
    const promises = []
    for (let i = 0; i <= Math.floor(meta.width / tileSize); i++) {
      for (let j = 0; j <= Math.floor(meta.height / tileSize); j++) {
        promises.push(new Promise(function (resolve, reject) {
          const options = {
            left: i * tileSize,
            top: j * tileSize,
            width: (i + 1) * tileSize < meta.width ? tileSize : meta.width - i * tileSize,
            height: (j + 1) * tileSize < meta.height ? tileSize : meta.height - j * tileSize
          }
          if (!(!options.width || !options.height)) {
            image.extract(options)
            .jpeg({
              quality: 80
            })
            .withMetadata()
              .toFile(join(tilesOutFolder, `${imageName}_${i}_${j}.jpg`), err => {
              if (err) {
                reject(err)
              }
              if (!j && IS_DEBUG) {
                console.log(`Row ${i}/${Math.floor(meta.width / tileSize)}`)
              }
              resolve()
            })
          } else {
            resolve()
          }
        }))
      }
    }
    Promise.all(promises).then(resolve).catch(reject)
  })
}

const createPyramid = async (fileName, outFolder = '') => {
  if (!fileName || !outFolder) throw new Error('Parameters must be not empty')
  if (typeof fileName !== 'string' || typeof outFolder !== 'string') throw new Error('Parameters must be are string')
  if (!existsSync(fileName)) throw new Error('Image file not found')
  const scales = [1024, 2048, 4096, 8192, 16384, 32768, 65536]
  const imageName = basename(fileName, extname(fileName))
  const image = sharp(fileName, {
    limitInputPixels: false,
    pages: -1
  })
  if (outFolder === '') outFolder = dirname(fileName)
  const pyramidOutFolder = join(outFolder)
  try {
    if (!existsSync(pyramidOutFolder)) {
      mkdirSync(pyramidOutFolder, {
        recursive: true
      })
    }
  } catch (error) {
    throw new Error('Invalid out directory')
  }
  const resizePromises = []
  const meta = await image.metadata()
  return new Promise((resolve, reject) => {
    for (let i = 0; i < scales.length; i++) {
      const scale = scales[i]
      if (scale > Math.max(meta.width, meta.height)) {
        continue
      }
      resizePromises.push(new Promise((resolve, reject) => {
        try {
          const outFileName = join(pyramidOutFolder, `${imageName}_${scale}.jpg`)
          image.resize(scale)
            .jpeg({
              quality: 100
            })
            .toFile(outFileName, (err) => {
              if (err) {
                reject(err)
              }
              resolve(outFileName)
            })
        } catch (error) {
          reject(error)
        }
      }))
    }
    Promise.all(resizePromises).then(resolve).catch(reject)
  })
}

module.exports = {
  createTiles,
  createPyramid
}
