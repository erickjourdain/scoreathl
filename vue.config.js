module.exports = {
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
