'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {

        // Paths
        env: require('./dev.env'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {},

    // Various Dev Server settings
    // host: '192.168.43.85', // can be overwritten by process.env.HOST
    host: '10.31.23.223', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    
    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: false
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),
    fh: path.resolve(__dirname, '../dist/fh.html'),
    jjzh: path.resolve(__dirname, '../dist/jjzh.html'),
    wtcx: path.resolve(__dirname, '../dist/wtcx.html'),
    cjcx: path.resolve(__dirname, '../dist/cjcx.html'),
    jjzhcx: path.resolve(__dirname, '../dist/jjzhcx.html'),
    kh: path.resolve(__dirname, '../dist/kh.html'),
    wdjj: path.resolve(__dirname, '../dist/wdjj.html'),
    jjxq: path.resolve(__dirname, '../dist/jjxq.html'),
    ydqrs:path.resolve(__dirname,'../dist/ydqrs.html'),
    jjdmcx:path.resolve(__dirname,'../dist/jjdmcx.html'),
    pdf: path.resolve(__dirname, '../dist/pdf.html'),
    /* btnFir */
    rgsg: path.resolve(__dirname, '../dist/rgsg.html'),
    jjsh: path.resolve(__dirname, '../dist/jjsh.html'),
    cxwt: path.resolve(__dirname, '../dist/cxwt.html'),
    // 定投
    jjdt: path.resolve(__dirname, '../dist/jjdt.html'),
    dtsq: path.resolve(__dirname, '../dist/dtsq.html'),
    dtbg: path.resolve(__dirname, '../dist/dtbg.html'),
    dtcx: path.resolve(__dirname, '../dist/dtcx.html'),
    yjzcn: path.resolve(__dirname, '../dist/yjzcn.html'),
    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',

    /**
     * Source Maps
     */

    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
