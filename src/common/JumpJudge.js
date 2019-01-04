
import tdxct from '../lib/connect'
//iOS登录成功回调
function OnTdxTradeLoginOK() {
  var paramsso = JSON.parse(localStorage.index_kefu_paramsso);
  sso('/xc/m1/trade/index.html#!/account/accountView.html', '账户分析');
}

// 检查TdxWebCall存在状态
function checkTdxJava() {
  if (window.tdx_java && window.tdx_java.TdxWebCall) {
    return true;
  } else {
    return false;
  }
}

/*
 * IOS函数桥接
 */
var IOS_Bridge = {

  callbacksCount: 1,
  callbacks: {},

  resultForCallback: function resultForCallback(callbackId, resultArray) {
    try {
      var callback = IOS_Bridge.callbacks[callbackId];
      if (!callback) {
        return;
      }
      callback.apply(null, resultArray);
    } catch (e) {
      // alert(e);
    }
  },

  /*
   * functionName: 调用函数名称
   * args:json 格式参数
   * callback 回调函数，可有可无
   */
  call: function call(functionName, args, funcID, frameID, callback) {

    var hasCallback = callback && typeof callback == "function";
    var callbackId = hasCallback ? IOS_Bridge.callbacksCount++ : 0;

    if (hasCallback) {
      IOS_Bridge.callbacks[callbackId] = callback;
    }
    var iframe = document.createElement("IFRAME");
    iframe.setAttribute("src", "tdx-frame:" + functionName + ";;" + frameID + ";;" + funcID + ";;" + args + ";;" + callback);

    document.documentElement.appendChild(iframe);
    iframe.parentNode.removeChild(iframe);
    iframe = null;

  }
};

// 页面切换 param1是否为机会,param2是否禁用分享
function toCallJavaUrl(mode, title, url, shareinfo, topbar) {
  if (checkTdxJava()) {
    if (typeof url !== 'string') {
      var url = url["Android"];
    }
    if (mode == "Java") {
      var tdxFuncParam = {
        "JumpPageID": url
      }
      // window.tdx_java.TdxWebCall("tdxOpenNativeModule", JSON.stringify(tdxFuncParam), "", "");
      window.tdx_java.TdxWebCall("tdxJumpPage", JSON.stringify(tdxFuncParam), "", "");
    } else if (mode == "JavaMode") {
      var tdxFuncParam = {
        "OpenID": url
      }
      // alert("Proc: " + "TdxWebCall" + "\nParams: " + JSON.stringify(["tdxOpenNativeModule", tdxFuncParam, "", ""]));
      window.tdx_java.TdxWebCall("tdxOpenNativeModule", JSON.stringify(tdxFuncParam), "", "");
    } else if (mode == "newFunc") {
      window.tdx_java.TdxWebCall(url, '', "", "");

      // tdxct.webCallTql.send(url, {}, function (data) {
      //   //callback(data);
      // });
    } else if (mode == "JavaSec") {
      var tdxFuncParam = {
        "OpenID": "tdxJycc",
        "OpenParam": {
          "HostType": url
        }
      }
      window.tdx_java.TdxWebCall("tdxOpenJyFunc", JSON.stringify(tdxFuncParam), "", "");
    } else if (mode == "NetURL") {
      var _shareinfo = shareinfo || {};
      _shareinfo["Time"] = +new Date().toString();
      _shareinfo["DisableShare"] = '1';

      var tdxFuncParam = {
        "OpenName": title,
        "OpenType": "native",
        "OpenUrl": url,
        "OpenParam": {
          "UrlType": "Remote"
        },
        "ShareInfo": _shareinfo
      }
      window.tdx_java.TdxWebCall("tdxOpenUrl", JSON.stringify(tdxFuncParam), "", "");
    } else if (mode == "LocalURL") {
      var _shareinfo = shareinfo || {};
      _shareinfo["Time"] = +new Date().toString();
      _shareinfo["DisableShare"] = '1';

      var tdxFuncParam = {
        "OpenName": title,
        "OpenType": "native",
        "OpenUrl": url,
        "OpenParam": {
          "UrlType": "Absolute",
          "NoTopBarFlag": topbar
        },

        "ShareInfo": _shareinfo
      }
      window.tdx_java.TdxWebCall("tdxOpenUrl", JSON.stringify(tdxFuncParam), "", "");
    } else if (mode == "Browser") {
      var tdxFuncParam = {
        "OpenName": title,
        "OpenType": "browser",
        "OpenUrl": url,
        "OpenParam": {
          "UrlType": "Remote"
        },
        "ShareInfo": {
          "Time": new Date().getTime().toString()
        }
      }
      window.tdx_java.TdxWebCall("tdxOpenUrl", JSON.stringify(tdxFuncParam), "", "");
    } else if (mode == "xgrl") {
      var tdxFuncParam = {
        "OpenParam": {
          "Target": url
        }
      }
      window.tdx_java.TdxWebCall("tdxXgslReq", JSON.stringify(tdxFuncParam), title, "");
    }
  } else {
    if (typeof url !== 'string') {
      var url = url["ios"];
    }
    if (mode == "Java") {
      var tdxFuncParam = {
        "JumpPageID": url
      }
      // IOS_Bridge.call("WebCall", JSON.stringify(tdxFuncParam), "tdxOpenNativeModule", "", undefined);
      IOS_Bridge.call("WebCall", JSON.stringify(tdxFuncParam), "tdxJumpPage", "", undefined);
    } else if (mode == "JavaMode") {
      var tdxFuncParam = {
        "OpenID": url
      }
      IOS_Bridge.call("WebCall", JSON.stringify(tdxFuncParam), "tdxOpenNativeModule", "", undefined);
    } else if (mode == "JavaSec") {
      var tdxFuncParam = {
        "OpenID": "tdxJycc",
        "OpenParam": {
          "HostType": url
        }
      }
      IOS_Bridge.call("WebCall", JSON.stringify(tdxFuncParam), "tdxOpenJyFunc", "", undefined);
    } else if (mode == "NetURL") {
      var tdxFuncParam = {
        "OpenName": title,
        "OpenType": "native",
        "OpenUrl": url,
        "OpenParam": {
          "UrlType": "Remote",
          "NoEncodeURL": "1"
        },
        /*"ShareInfo": {"Time": new Date().getTime().toString(), "DisableShare": 1}*/
      }
      if (url.indexOf("target_url") > -1) {
        tdxFuncParam.OpenParam.NoEncodeURL = "0";
      }
      IOS_Bridge.call("WebCall", JSON.stringify(tdxFuncParam), "tdxOpenUrl", "", undefined);
    } else if (mode == "LocalURL") {
      var tdxFuncParam = {
        "OpenName": title,
        "OpenType": "native",
        "OpenUrl": url,
        "OpenParam": {
          "UrlType": "Absolute",
          "NoTopBarFlag": topbar
        },
        "ShareInfo": {
          "Time": new Date().getTime().toString(),
          "DisableShare": 1
        }
      }
      IOS_Bridge.call("WebCall", JSON.stringify(tdxFuncParam), "tdxOpenUrl", "", undefined);
    } else if (mode == "Browser") {
      var tdxFuncParam = {
        "OpenName": title,
        "OpenType": "browser",
        "OpenUrl": url,
        "OpenParam": {
          "UrlType": "Remote"
        },
        "ShareInfo": {
          "Time": new Date().getTime().toString(),
          "DisableShare": 1
        }
      }
      IOS_Bridge.call("WebCall", JSON.stringify(tdxFuncParam), "tdxOpenUrl", "", undefined);
    } else if (mode == "xgrl") {
      var tdxFuncParam = {
        "OpenParam": {
          "Target": url
        }
      }
      IOS_Bridge.call("WebCall", JSON.stringify(tdxFuncParam), "tdxXgslReq", "", title);
    } else if (mode == "newFunc") {
      IOS_Bridge.call("WebCall", "", url, "", title);
    }
  }
}

//5010后台对接
function sso(url, name, type) {
  var paramsso = {
    url: url,
    name: name,
    type: type
  }
  localStorage.index_kefu_paramsso = JSON.stringify(paramsso);
  var param = {
    "HostType": "0",
    "NeedCallBack": "0"
  };
  if (localStorage.account == undefined) {
    var accountObj = [];
  } else {
    var accountObj = JSON.parse(localStorage.account);
  }

  //获取交易账号
  tdxct.tdxgetAccList(function (data) {
    var curUser;
    if (typeof data == "string") { // ios
      data = JSON.parse(data);
    }

    if (data.length > 0) {
      if (typeof data[0] == "string") {
        curUser = JSON.parse(data[0]);
      } else {
        curUser = data[0];
      }
    }

    if (!curUser) {
      if (type == 1) {
        var jumpUrl = home_config.set_url + '?mobile_phone=' + null + '&fund_account=' + null + '&user_id=' + null + '&channel_from=tdx&encrypt_data=' + null + '&target_url=' + encodeURIComponent(url);

        //登录系统
        if (tdxct.tdxMobSystem == "WEB-Android" || tdxct.tdxMobSystem == "Android") {
          toCallJavaUrl('NetURL', name, jumpUrl, "", "", "");
        } else if (tdxct.tdxMobSystem == "IOS") {
          toCallJavaUrl('NetURL', name, jumpUrl, "", "", "", "1");
        }
      } else {
        //交易登录
        tdxct.tdxLoginBox(param, function (data) {});
      }
    } else {
      tdxct.tdxGetRegTel(function (mobileData) {
        if (typeof mobileData == "string") {
          mobileData = JSON.parse(mobileData);
        }
        var mobile = mobileData[3][0];
       
        send(curUser.KHH, mobile);
      })
    }
  })

  function send(khh, phoneNum) {
    
    if (localStorage.account == undefined) {
      var funcid = 'XCZQLogin:UumsLogin';
      var userArr = [{
        "login_type": "201",
        "merchant_id": "tdx",
        "login_account": khh,
        "password": "##PWD##",
        "client_ip": "",
        "mobile_phone": phoneNum,
      }];
      
      if (tdxct.tdxMobSystem == "WEB-Android" || tdxct.tdxMobSystem == "Android") {
        var sendParam = [{
          '1202': funcid
        }, {
          "1228": "2"
        }, {
          '1227': userArr
        }];
      } else if (tdxct.tdxMobSystem == "IOS" ) {
        var sendParam = [{
          tdxPageID: "_UrlEncode"
        }, {
          '1202': funcid
        }, {
          "1228": "2"
        }, {
          '1227': userArr
        }];
      }

      tdxct.JYCallTql('5010', sendParam,{Way: "qs"}, function (data) {
        var data = JSON.parse(data);
        
        data = JSON.parse(data[3][2])
        console.log(data)
        data = data[3];
        
        var param = [{
          "mobile_phone": phoneNum,
          "fund_account": khh,
          "user_id": data[0],
          "channel_from": 'tdx',
          "encrypt_data": data[1],
          "target_url": ''
        }]

        var indexof = false;

        for (var s in accountObj) {
          if (accountObj[s].fund_account == khh) {
            accountObj[s].time = getNowFormatDate();
            accountObj[s].token = JSON.stringify(data);
            indexof = true;
            break;
          }
        }

        if (!indexof) {
          var localParam = {
            "fund_account": khh,
            "time": getNowFormatDate(),
            "token": JSON.stringify(data)
          }
          accountObj.push(localParam);
        }
        //保存本地账号
        localStorage.account = JSON.stringify(accountObj);

        var jumpUrl = home_config.set_url + '?mobile_phone=' + phoneNum + '&fund_account=' + khh + '&user_id=' + data[0] + '&channel_from=tdx&encrypt_data=' + encodeURIComponent(data[1]) + '&target_url=' + encodeURIComponent(url);
        //登录系统
        if (tdxct.tdxMobSystem == "WEB-Android" || tdxct.tdxMobSystem == "Android") {
          toCallJavaUrl('NetURL', name, jumpUrl, "", "", "");
        } else if (tdxct.tdxMobSystem == "IOS" ) {
          toCallJavaUrl('NetURL', name, jumpUrl, "", "", "", "1");
        }
      })
    } else {
      
      //判断当前账号是否有token缓存
      var indexof = false;
      for (var s in accountObj) {
        
        if (accountObj[s].fund_account == khh) {
          
          indexof = true;
          var time2 = getNowFormatDate();
          var timediff = TimeDifference(time2, accountObj[s].time);
          if (timediff < 60) {
            
            var data = JSON.parse(accountObj[s].token);
            var jumpUrl = home_config.set_url + '?mobile_phone=' + phoneNum + '&fund_account=' + khh + '&user_id=' + data[0] + '&channel_from=tdx&encrypt_data=' + encodeURIComponent(data[1]) + '&target_url=' + encodeURIComponent(url);
            //登录系统
            if (tdxct.tdxMobSystem == "WEB-Android" || tdxct.tdxMobSystem == "Android") {
             
              toCallJavaUrl('NetURL', name, jumpUrl, "", "", "");
            } else if (tdxct.tdxMobSystem == "IOS") {
              toCallJavaUrl('NetURL', name, jumpUrl, "", "", "", "1");
            }
          } else {
            var funcid = 'XCZQLogin:UumsLogin';
            var userArr = [{
              "login_type": "201",
              "merchant_id": "tdx",
              "login_account": khh,
              "password": "##PWD##",
              "client_ip": "",
              "mobile_phone": phoneNum,
            }];

            if (tdxct.tdxMobSystem == "WEB-Android" || tdxct.tdxMobSystem == "Android") {
              var sendParam = [{
                '1202': funcid
              }, {
                "1228": "2"
              }, {
                '1227': userArr
              }];
            } else if (tdxct.tdxMobSystem == "IOS") {
              var sendParam = [{
                tdxPageID: "_UrlEncode"
              }, {
                '1202': funcid
              }, {
                "1228": "2"
              }, {
                '1227': userArr
              }];
            }
            //var sendParam = [{tdxPageID: "_UrlEncode"}, {'1202': funcid}, {"1228": "2"}, {'1227': userArr}];
            tdxct.JYCallTql('5010', sendParam,{ Way: "qs"}, function (data) {
              var data = JSON.parse(data);
              data = JSON.parse(data[3][2])
              data = data[3];

              var param = [{
                "mobile_phone": phoneNum,
                "fund_account": khh,
                "user_id": data[0],
                "channel_from": 'tdx',
                "encrypt_data": data[1],
                "target_url": ''
              }]

              accountObj[s].time = getNowFormatDate();
              accountObj[s].token = JSON.stringify(data);
              //保存本地账号
              localStorage.account = JSON.stringify(accountObj);
              var jumpUrl = home_config.set_url + '?mobile_phone=' + phoneNum + '&fund_account=' + khh + '&user_id=' + data[0] + '&channel_from=tdx&encrypt_data=' + encodeURIComponent(data[1]) + '&target_url=' + encodeURIComponent(url);

              //登录系统
              if (tdxct.tdxMobSystem == "WEB-Android" || tdxct.tdxMobSystem == "Android") {
                toCallJavaUrl('NetURL', name, jumpUrl, "", "", "");
              } else if (tdxct.tdxMobSystem == "IOS") {
                toCallJavaUrl('NetURL', name, jumpUrl, "", "", "", "1");
              }
            })
          }

          break;
        }
      }

      //账号token不存在的情况
      if (!indexof) {
        //直接取token
        var funcid = 'XCZQLogin:UumsLogin';
        var userArr = [{
          "login_type": "201",
          "merchant_id": "tdx",
          "login_account": khh,
          "password": "##PWD##",
          "client_ip": "",
          "mobile_phone": phoneNum,
        }];

        if (tdxct.tdxMobSystem == "WEB-Android" || tdxct.tdxMobSystem == "Android") {
          var sendParam = [{
            '1202': funcid
          }, {
            "1228": "2"
          }, {
            '1227': userArr
          }];
        } else if (tdxct.tdxMobSystem == "IOS") {
          var sendParam = [{
            tdxPageID: "_UrlEncode"
          }, {
            '1202': funcid
          }, {
            "1228": "2"
          }, {
            '1227': userArr
          }];
        }
        //var sendParam = [{tdxPageID: "_UrlEncode"}, {'1202': funcid}, {"1228": "2"}, {'1227': userArr}];
        tdxct.JYCallTql('5010', sendParam,{ Way: "qs"}, function (data) {
          var data = JSON.parse(data);
          data = JSON.parse(data[3][2])
          data = data[3];

          var param = [{
            "mobile_phone": phoneNum,
            "fund_account": khh,
            "user_id": data[0],
            "channel_from": 'tdx',
            "encrypt_data": data[1],
            "target_url": ''
          }]

          var localParam = {
            "fund_account": khh,
            "time": getNowFormatDate(),
            "token": JSON.stringify(data)
          }
          accountObj.push(localParam);

          //保存本地账号
          localStorage.account = JSON.stringify(accountObj);
          var jumpUrl = home_config.set_url + '?mobile_phone=' + phoneNum + '&fund_account=' + khh + '&user_id=' + data[0] + '&channel_from=tdx&encrypt_data=' + encodeURIComponent(data[1]) + '&target_url=' + encodeURIComponent(url);

          //登录系统
          if (tdxct.tdxMobSystem == "WEB-Android" || tdxct.tdxMobSystem == "Android") {
            toCallJavaUrl('NetURL', name, jumpUrl, "", "", "");
          } else if (tdxct.tdxMobSystem == "IOS" ) {
            toCallJavaUrl('NetURL', name, jumpUrl, "", "", "", "1");
          }
        })
      }
    }
  }
}

//获取时间函数
function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds();
  return currentdate;
}


//获取时间差
function TimeDifference(time1, time2) {
  var begin1 = time1.substr(0, 10).split("-");
  var end1 = time2.substr(0, 10).split("-");
  var date1 = new Date(begin1[1] + "/" + begin1[2] + "/" + begin1[0]);
  var date2 = new Date(end1[1] + "/" + end1[2] + "/" + end1[0]);
  var m = parseInt(Math.abs(date2 - date1) / 1000 / 60);
  var min1 = parseInt(time1.substr(11, 2)) * 60 + parseInt(time1.substr(14, 2));
  var min2 = parseInt(time2.substr(11, 2)) * 60 + parseInt(time2.substr(14, 2));
  var n = min2 - min1;
  var minutes = m + n;
  return minutes;
}
// 全局配置
//测试
// var home_config = {
//     set_url:"http://wpttest.xcsc.com/wind.html",
//     notice_url : "http://180.169.89.22:15016/main/customer/upload/nxlc/mobileTradeNotice.shtml",
// 	shortcut: {          //应用市场配置
//         show: true,
//         changeTime: 300, // 多标签页切换动画时间
//         itemLists: [
//             {
//                 Title: "服务中心",
//                 shortcutType: 0,
//                 dataList: [
//                     {
//                         shortcutType: 0,
//                         show: true,
//                         shortcutName: "业务办理",
//                         shortcutImg: "img/ywbl.png",
//                         jumpParam: {
//                             OpenName: "业务办理",
//                             OpenType: 'native', //native
//                             OpenUrl: "/ywbl/wande.do",
//                             OpenParam: {
//                                 UrlType: 'Remote', //Absolute Remote
//                                 WebViewType: 'NetURL', //LocalURL NetURL
//                                 NoEncodeURL: "1"
//                             }
//                         }
//                     },
//                 ]
//             }

//         ]
//     },
    

    
// }
export { //添加export抛出模块
  sso
}
