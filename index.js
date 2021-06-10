const sharp = require('sharp')
const { join, basename, extname } = require('path')
const { mkdir } = require('fs')

const createTiles = async (fileName, outFolder, tileSize=512) => {
  const image = sharp(fileName, {
    limitInputPixels: false,
    pages: -1,
  })
  const tilesOutFolder = join(outFolder, basename(fileName, extname(fileName)))
  mkdir(tilesOutFolder, function (err) {
    console.error(err)
  })
  const meta = await image.metadata()
  const promises = []
  for (let i = 0; i <= Math.floor(meta.width / tileSize); i++) {
    for (let j = 0; j <= Math.floor(meta.height / tileSize); j++) {
      promises.push(new Promise(function(resolve, reject) {
        image.extract({
            left: i * tileSize,
            top: j * tileSize,
            width: (i + 1) * tileSize < meta.width ? tileSize : meta.width - i * tileSize,
            height: (j + 1) * tileSize < meta.height ? tileSize : meta.height - j * tileSize
          })
          .jpeg({
            quality: 65
          })
          .withMetadata()
          .toFile(join(tilesOutFolder, `${i}_${j}.jpg`), err => {
            if (err) {
              reject(err)
              return
            }
            if (!j) {
              console.log(`Row ${i}/${Math.floor(meta.width / tileSize)}`)
            }
            resolve()
          })
      }))
    }
  }
const createPyramid = (fileName, outFolder="") => {
  return new Promise(async (_resolve, _reject) => {
    const scales = [1024, 2048, 4096, 8192, 16384, 32768, 65536]
    const image = sharp(fileName, {
      limitInputPixels: false,
      pages: -1,
    })
    if (outFolder === "") outFolder = dirname(fileName)
    const pyramidOutFolder = join(outFolder, basename(fileName, extname(fileName)))
    try {
      if (!existsSync(pyramidOutFolder)) {
        mkdirSync(pyramidOutFolder, {
          recursive: true
        })
      }
    }
    catch(error) {
      _reject(error)
    }
    const resizePromises = []
    const meta = await image.metadata()
    for(let i = 0; i < scales.length; i++){
      const scale = scales[i]
      if (scale > Math.max(meta.width, meta.height)) {
        continue
      }
      resizePromises.push(new Promise((resolve, reject) => {
        try {
          image.resize(scale)
            .jpeg({
              quality: 100
            })
            .toFile(join(pyramidOutFolder, `${scale}.jpg`), (err, info) => {
              if (err) {
                reject(err)
              }
              resolve('ok')
            })
        } catch (error) {
          reject(error)
        }
      }))
    }
    await Promise.all(resizePromises).then(_resolve).catch(_reject)
  })
}

module.exports = {
  createTiles,
  createPyramid
}