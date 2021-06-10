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
  // For future updates with stats presenting:
  // const results = await Promise.all(promises)
  await Promise.all(promises)
}

module.exports = {
  createTiles
}