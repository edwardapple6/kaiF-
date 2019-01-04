// var urlHead = 'http://10.31.23.223:8080/';
// var urlHead = 'http://192.168.43.85:8080/';
var urlHead = 'tdx-trade-kfsjj/';

var pageURL = {
  readptoUrl: urlHead + 'ydqrs.html',
  khUrl: urlHead + 'kh.html',
  index: urlHead + 'index.html',
  wtcxUrl: urlHead + 'wtcx.html',
  cjcxUrl: urlHead + 'cjcx.html',
  fhUrl: urlHead + 'fh.html',
  jjzhUrl: urlHead + 'jjzh.html',
  yjzcnUrl: urlHead + 'yjzcn.html',
  jjdmcxUrl: urlHead + 'jjdmcx.html',
  jjzhcxUrl: urlHead + 'jjzhcx.html',
  jjxqUrl: urlHead + 'jjxq.html',
  wdjjUrl: urlHead + 'wdjj.html',
  jjshUrl: urlHead + 'sh.html'
}
//远程调试类型
//  var jumpType = {
//   UrlType: 'Remote', // ['Remote', 'Absolute']
//   WebViewType: 'NetURL' // ['NetURL', 'LocalURL', 'JyURL']
//  }
 //本地类型
 var jumpType = {
  UrlType: 'Absolute', // ['Remote', 'Absolute']
  WebViewType: 'LocalURL' // ['NetURL', 'LocalURL', 'JyURL']
 }
export { //添加export抛出模块
  pageURL,
  jumpType
}
