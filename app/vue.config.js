module.exports = {
    devServer: {
      proxy: {
        '/datos': {
            target: 'https://bitcoin-alejo-2.herokuapp.com',
            changeOrigin: true,
            pathRewrite: {
                '^/datos': ''
            }
    }
  }
}
}
