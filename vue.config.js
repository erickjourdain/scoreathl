const path = require('path')

module.exports = {
  chainWebpack: config => {
    const oneOfsMap = config.module.rule('scss').oneOfs.store
    oneOfsMap.forEach(item => {
      item
        .use('sass-loader')
        .loader('sass-loader')
        .end()
    })
  },
  devServer: {
    watchOptions: {
      poll: true
    },
    disableHostCheck: true
  },
  configureWebpack: {
    devtool: 'source-map'
  }
}
