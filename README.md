# Big image viewer

Node.js lib for big image tiling and creating pyramids layers for web browser viewer. Result work like most types of web map: [Google Maps](https://www.google.com/maps), [Leaflet](https://leafletjs.com)

Tiles generate in [jpeg](https://en.wikipedia.org/wiki/JPEG) format, so it`s easy to use with custom web viewers
The pyramids created keep the proportions of the original image. The larger side of the pyramid will have a *power of 2* size. For example, for an input image with dimensions **2560x1920**, pyramids with dimensions **1024x768**, **2048x1536** will be created

## Installation

npm:

```$ npm i big-image-viewer```

Yarn:

```$ yarn add big-image-viewer```

## Using example

Basing use example. Creating pyramids and tiles for input image, with tileSize 1024x1024 (default is 512x512)

```javascript
  import { processImage } from 'big-image-viewer'

  const inputBigImage = 'very-huge-image.tif'
  const outFolder = 'public/very-huge-image/'
  const customTileSize = 1024
  processImage(inputBigImage, outFolder, tileSize)

```
