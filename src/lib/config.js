/* 配置一些全局变量 */
'use strict'

module.exports = {
  /* dev */
  // link: 'http://192.168.0.101:8081/', // 总部
  // link: 'http://192.168.43.85:8080/', // 湘财
  link: 'http://10.31.23.223:8080/', // 湘财
  OpenParam: {
    UrlType: 'Remote', // ['Remote', 'Absolute']
    WebViewType: 'NetURL' // ['NetURL', 'LocalURL', 'JyURL']
  },
  time: 1
  /* prod */
  // link: 'tdx-trade-kfsjj/', // 本地
  // OpenParam: {
  //   UrlType: 'Absolute',
  //   WebViewType: 'LocalURL'
  // },
  // time: 3 
}
