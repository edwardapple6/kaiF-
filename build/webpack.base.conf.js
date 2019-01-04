'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')
var webpack = require('webpack')
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}



module.exports = {
  context: path.resolve(__dirname, '../'),
  // entry: {
  //   app: './src/main.js'
  // },
  entry: {
    app: './src/main.js',
    // cd: './src/pages/cd/cd.js',
    // gm: './src/pages/gm/gm.js',
    // sh:'./src/pages/sh/sh.js',
    fh: './src/pages/fh/fh.js',
    jjzh: './src/pages/jjzh/jjzh.js',
    wtcx: './src/pages/wtcx/wtcx.js',
    cjcx: './src/pages/cjcx/cjcx.js',
    jjzhcx: './src/pages/jjzhcx/jjzhcx.js',
    kh: './src/pages/kh/kh.js',
    wdjj: './src/pages/wdjj/wdjj.js',
    jjxq: './src/pages/jjxq/jjxq.js',
    // dtym:'./src/pages/dtym/dtym.js',
    ydqrs:'./src/pages/ydqrs/ydqrs.js',
    jjdmcx: './src/pages/jjdmcx/jjdmcx.js',
    jjdt: './src/secpages/btnSec/jjdt.js',
    pdf: './src/secpages/PDF/pdf.js',
    rgsg: './src/secpages/btnFir/rgsg.js',
    jjsh: './src/secpages/btnFir/jjsh.js',
    cxwt: './src/secpages/btnFir/cxwt.js',
    dtsq: './src/secpages/btnSec/dtsq.js',
    dtbg: './src/secpages/btnSec/dtbg.js',
    yjzcn: './src/secpages/btnFor/yjzcn.js'
    // dtcx: './src/secpages/btnSec/dtcx.js',
    // jjfh: './src/secpages/btnSec/jjfh.js',
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production' ?
      config.build.assetsPublicPath : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
  module: {
    rules: [{
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      jquery: "jquery",
      "window.jQuery": "jquery"
    })
  ],
}
