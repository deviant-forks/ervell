// @ts-check

const fs = require('fs')
const path = require('path')

const { NODE_ENV } = process.env
const isDevelopment = NODE_ENV === 'development'
const rootDir = process.cwd()

function findAssets(basePath) {
  const files = fs.readdirSync(path.join(rootDir, basePath))

  // Filter out .styl files
  const validAssets = file => {
    const whitelist = ['.js', '.coffee']

    const isValid = whitelist.some(
      extension => extension === path.extname(file)
    )

    return isValid
  }

  /**
   * Construct key/value pairs representing Webpack entrypoints; e.g.,
   * { desktop: [ path/to/desktop.js ] }
   */
  return files.filter(validAssets).reduce((assetMap, file) => {
    const fileName = path.basename(file, path.extname(file))
    const asset = {
      [fileName]: [path.join(rootDir, basePath, file)],
    }

    // Load oldschool global module dependencies
    asset[fileName].unshift(path.join(rootDir, 'src/lib/global_modules'))

    if (isDevelopment) {
      asset[fileName].unshift('webpack-hot-middleware/client?reload=true')
    }

    return {
      ...assetMap,
      ...asset,
    }
  }, {})
}

function getEntrypoints() {
  return {
    ...findAssets('./src/assets'),
  }
}

module.exports = {
  getEntrypoints,
  findAssets,
}
