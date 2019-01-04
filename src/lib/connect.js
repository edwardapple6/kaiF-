/* eslint-disable */
/*
 * @Author: ypf
 * @Date:   2017-07-06 16:46:13
 */
import tsClient from './tsclient.js';
import tdxBsc from './base64.js';
class tdxConnect {
  constructor(option) {

    if (typeof option != 'object') {
      option = {};
    }

    /**
     * [g_tdx_log 通讯日志开关 ]
     * @type {Boolean}
     */
    this.tdxLog = option.tdxLog || false;

    /**
     * [tdxCallBackFuncObj 回调函数字典]
     * @type {Object}
     */
    this.tdxCallBackFuncObj = {};

    /***创建TS_client对象***/
    this.tdxClientObj = tsClient.CreateTDXClient({
      // serverType:,
      needReserve: option.needReserve || false,
      needLogin: option.needLogin || false,
      preLoginFuncList: [],
      notify: function(msgType, data, obj) {}
    });
    this.mCallTQL = this.tdxClientObj.execute.bind(this.tdxClientObj);

    this.tdxMobSystem = this.tdxCheckMobSys();
    this.tdxformidDict = {};
  }

  /**
   * [ tdxCheckMobSys 检测手机系统]
   * @return {[String]}
   */
  tdxCheckMobSys() {
    let clientType = '';
    let ngr = navigator.userAgent.toLowerCase();

    /***pc客户端***/
    // TDXQuery 为新版webkit拓展调用方法
    if (window.TDXQuery) {
      clientType = "PCCEF";

    } else if (window.external && window.external.CallTQL) {
      clientType = "PC";
    }

    /***ios-app应用内***/
    let iosMatches = /tdxios/i.test(ngr);
    if (iosMatches) {
      let wlh = window.location.href;
      if (wlh.indexOf('http') === 0 || wlh.indexOf('https') === 0) {
        clientType = 'WEB-IOS';
      } else {
        clientType = 'IOS';
      }
    }

    /*** Android-app 安卓app应用内***/
    let androidMatches = /tdxandroid/i.test(ngr);
    if (androidMatches) {
      let wlh = window.location.href;
      if (wlh.indexOf('http') === 0 || wlh.indexOf('https') === 0) {
        clientType = 'WEB-Android';
      } else {
        clientType = 'Android';
      }
    }

    /***wechat-app 微信内嵌浏览器内***/
    let wechatMatches = /micromessenger/i.test(ngr);
    if (wechatMatches) {
      clientType = 'WX';
    }

    if (this.tdxLog) {
      console.log("%c环境类型-clientType：" + clientType, 'color:Rred')
    }

    return clientType;

  }

  /***返回URL的一个随机串***/
  /**
   * @return {[string]}
   */
  getRnd() {
    return 'tdx:' + parseInt(Math.random() * 10000) + "&" + parseInt(Math.random() * 10000);
  }

  /**
   * @param {[func]}
   * @return {string} [函数名]
   */
  getFuncName(func) {
    let fct = func.toString();
    let re = /function\s*(\w*)/i;
    var matches = re.exec(fct);

    return matches[1];
  }

  /**
   * [_theTime 获取当前时间-时分秒 ]
   * @return {[stirng ]}
   */
  getCurTime() {
    let myDate = new Date();
    let myhours = myDate.getHours();
    let myminutes = myDate.getMinutes();
    let myseconds = myDate.getSeconds();
    let mymilliseconds = myDate.getMilliseconds();

    return myhours + ':' + myminutes + ':' + myseconds + ':' + mymilliseconds;
  }

  /***针对远程url,http、https请求动态调整调用方式，
  "tphttp"、"tpws"、 "pc"、"pccef"、"ios" "android" "http" "tqlex"
  默认激活TQLEX调用方式***/
  activeServerType(type) {
    let setServerType = this.tdxClientObj.setServerType.bind(this.tdxClientObj);
    setServerType(type || "tqlex");
  }


  /***IOS与硬代码通讯通过iframe创建请求调用方式***/
  tdxIosCall(strCallWay, args, strFuncName, frameID, callback) {

    let iframe = document.createElement("IFRAME");
    iframe.style.display = 'none';
    iframe.setAttribute("src", "tdx-frame:" + strCallWay + ";;" + frameID + ";;" + strFuncName + ";;" + args + ";;" + callback);
    document.documentElement.appendChild(iframe);
    iframe.parentNode.removeChild(iframe);
    iframe = null;
  }


  /***转发请求到ts_client.js***/
  /**
   * @param {[string]}  strFuncName  功能号
   * @param {[string]}  cparams      入参
   * @param {[function]}callbk       回调函数
   * @param {[object]}  otherparams  其他参数
   */
  NcallTql(strFuncName, cparams, callbk, otherparams) {
    let __formid = otherparams.formid;
    let __Way = otherparams.Way;

    if (strFuncName == 'TSTC.uinfo' && this.tdxMobSystem != 'IOS' && this.tdxMobSystem != 'Android') {
      callbk(this.tdxformidDict[__formid], strFuncName, 0, localStorage.getItem('uinfo'));
      return;
    }

    let that = this;
    this.mCallTQL(strFuncName, cparams, function(err, data) {
      if (err == undefined || err == null) {
        err = '';
      }
      if (that.tdxLog) {
        console.log([
          '接受应答:',
          '%c\nCallTQL请求详情，功能名-strFuncName: ' + strFuncName + '，入参-cparams：' + cparams,
          '%c应答结果：',
          '%c' + (typeof data === 'object') ? JSON.stringify(data) : data,
          '%c当前时间: ' + that.getCurTime(),
          ''
        ].join('\n'), 'color: green', 'color: red', 'color: blue', 'color: green');
      }


      /***券商服务请求应答原始返回***/
      if (__Way === 'qs') {
        callbk(data);
        return;
      }

      if (typeof data === 'string') {
        data = data.replace(/\r\n/g, "<br>");
        data = data.replace(/\r/g, "<br>");
        data = data.replace(/\n/g, "<br>");
        data = data.replace(/&nbsp;/g, " ");
      }

      try {
        if (that.tdxMobSystem != "IOS" && that.tdxMobSystem != "Android" && that.tdxMobSystem != 'WEB-IOS' && that.tdxMobSystem != 'WEB-Android') {
          let curHref = window.location.href;
          /***未登录，唤起登录***/
          if (data.indexOf('[-10000]') > -1 && curHref.indexOf('login.html') < 0) {
            that.tdxLoginBox();
          }
        } else {
          if (err == '-10000') {
            that.tdxLoginBox();
          }
        }

        if (otherparams.jyflag === 1) {

          callbk(that.tdxformidDict[__formid], strFuncName, err, data);
        } else {

          if (err != '0' && err != '') {
            data = '[[' + err + ',"' + data + '",0,"",0,""],[],[],[]]';
          }
          callbk(data);
        }

      } catch (ex) {
        /***具体错误处理***/
        data = '-999';
        err = '[[' + data + ',"' + ex + '",0,"",0,""],[],[],[]]';
        callbk(err);
      }

    }, otherparams); //'jyflag':0 默认新的交易通道(通用),'jyflag':1,针对交易webview  otherparams={'jyflag': 0};

  }

  /**
   * [sendRequest 请求参数统一处理]
   * @param  {[string]}    strCallWay   请求方式通道
   * @param  {[string]}    strFuncName  功能号、功能名
   * @param  {[object]}    paramsFuncData 请求入参
   * @param  {[object]}    objOptParam   通道参数
   * @param  {[function]}  funcCallBack  回调函数
   * @param  {[object]}    addParObj    其他参数
   */
  sendRequest(strCallWay, strFuncName, paramsFuncData, objOptParam, funcCallBack, addParObj) {

    // alert(typeof paramsFuncData === 'object' && paramsFuncData.length > 0)
    let PageId = '';
    if (typeof paramsFuncData === 'object' && paramsFuncData.length > 0) {
      PageId = paramsFuncData[0].tdxPageID;
      delete paramsFuncData[0].tdxPageID;
    }

    if (typeof paramsFuncData == 'object' && paramsFuncData["tdxPageID"]) {
      PageId = paramsFuncData.tdxPageID;
      delete paramsFuncData.tdxPageID;
    }

    // alert(PageId)

    let callback_name = typeof funcCallBack == "function" ? this.getFuncName(funcCallBack) : "none";

    let formid = this.getRnd() + '_$$$$$' + '_' + callback_name + PageId;
    this.tdxCallBackFuncObj[formid] = funcCallBack;

    if (typeof addParObj === 'object' && addParObj.formid != undefined && addParObj.formid != '') {
      this.tdxformidDict[formid] = addParObj.formid;
    }


    let addWay = '';
    if (typeof addParObj === 'object' && addParObj.hasOwnProperty('Way')) {
      addWay = addParObj.Way;
    }
    if (addWay === 'qs') {
      if (this.tdxMobSystem === 'WEB-IOS') {
        this.activeServerType('ios');
      } else if (this.tdxMobSystem === 'WEB-Android') {
        this.activeServerType('android');
      }
    }



    if (this.tdxMobSystem === "IOS" || this.tdxMobSystem === 'WEB-IOS') {
    // alert("formid"+JSON.stringify(formid))

      //处理tdx-IOS客户端请求
      let cparams = paramsFuncData;

      if (strCallWay === 'CallTQL') {
        if (this.tdxMobSystem == 'WEB-IOS' && addWay !== 'qs') {
          if (typeof paramsFuncData != 'string') {
            paramsFuncData = JSON.stringify(paramsFuncData);
          }
          this.NcallTql(strFuncName, paramsFuncData, funcCallBack, {
            'formid': formid,
            'Way': addWay
          });
          return;
        }

        /****新数据请求发送通道，支持发生到:行情、服务、交易****/
        let tmp = {
          "SessionType": objOptParam.sessionType,
          "TQLParam": paramsFuncData
        };

        if (objOptParam.sessionType === 'JYSession') {
          tmp.SessionID = objOptParam.SessionID;
          tmp.JYParam = paramsFuncData;
        }
        this.jsonExtend(tmp, objOptParam);
        cparams = JSON.stringify(tmp);

        this.NcallTql(strFuncName, cparams, funcCallBack, {
          'jyflag': 0,
          'formid': formid,
          'Way': addWay
        });


      } else if (strCallWay === 'WJyCallTql') {
        /****老交易请求发送通道****/
        if (typeof cparams != 'string') {
          cparams = JSON.stringify(cparams);
        }
        this.NcallTql(strFuncName, cparams, funcCallBack, {
          'jyflag': 1,
          'formid': formid
        });
      } else if (strCallWay === 'WebCall') {
        /***IOS客户端内部请求调用***/
        cparams = JSON.stringify(paramsFuncData);

        this.tdxIosCall(strCallWay, cparams, strFuncName, formid, 'tdxGetCallBack');
      }
    } else if (this.tdxMobSystem === 'Android' || this.tdxMobSystem == 'WEB-Android') {
      //处理tdx-Android客户端请求

      if (typeof paramsFuncData != 'string') {
        paramsFuncData = JSON.stringify(paramsFuncData);
      }

      if (strCallWay === "CallTQL") {
        /***新数据请求发送通道，支持发生到:行情、服务、交易***/
        let temp = {
          "SendSession": objOptParam.sessionType
        };
        if (objOptParam.sessionType === 'JYSession') {
          temp.SessionID = objOptParam.SessionID;
        }
        this.jsonExtend(temp, objOptParam);

        let SendSession = JSON.stringify(temp);
        this.NcallTql(strFuncName, paramsFuncData, funcCallBack, {
          'jyflag': 0,
          'formid': formid,
          'SendSession': SendSession,
          'Way': addWay
        });
        // window.tdx_java.TdxSendData(strFuncName, paramsFuncData, SendSession, 'tdxGetCallBack', formid);
      } else if (strCallWay === 'WJyCallTql') {
        /*
         老交易请求发送通道
         * */
        this.NcallTql(strFuncName, paramsFuncData, funcCallBack, {
          'jyflag': 1,
          'formid': formid
        });
      } else if (strCallWay === 'WebCall') {
        /***Android客户端内部请求调用***/
        window.tdx_java.TdxWebCall(strFuncName, paramsFuncData, 'tdxGetCallBack', formid);
      }

    } else {
      //处理tdx-其他客户端请求
      if (strCallWay === 'WJyCallTql' || objOptParam.hasOwnProperty("TSTC") || strFuncName.indexOf("TSTC.") >= 0) {
        if (this.tdxMobSystem === 'PCCEF') {
          /** 金融终端* */
          if (strFuncName = 'uinfo') {
            strFuncName = 'tc.getuinfo';
          } else {
            if (strFuncName.indexOf("FuncID(") == 0 && strFuncName.slice(strFuncName.length - 1) == ")") {
              strFuncName = strFuncName.slice(("FuncID(").length, strFuncName.length - 1);
            } else {
              strFuncName = 'atc.' + strFuncName;
            }
          }

          this.NcallTql(strFuncName, paramsFuncData, funcCallBack, {
            'jyflag': 1,
            'formid': formid
          });
        } else {
          let uinfo = localStorage.getItem('uinfo');
          // 如果这里检查到用户未登录，发 TSTC 请求的时候，必须去登录
          if (!uinfo) {
            this.tdxLoginBox(function(data) {});
            return;
          }

          /***原来硬代码的功能进行兼容***/
          if (strFuncName == "uinfo") {
            funcCallBack(addParObj.formid, strFuncName, "", uinfo);
            return;
          }

          /***微信交易的处理分支***/
          uinfo = JSON.parse(uinfo);
          let tmpParams = [{
            "@AddPreF": "1",
            "@QSID": uinfo.qsid,
            "F1235": "webwt",
            "F121": uinfo.zjzh
          }]

          if (typeof paramsFuncData == 'string') {
            paramsFuncData = JSON.parse(paramsFuncData);
          }

          try {
            if (strFuncName.indexOf("TSTC.") >= 0) {
              this.jsonExtend(tmpParams[0], paramsFuncData[0]);
            } else {
              strFuncName = 'TSTC.' + strFuncName;
              paramsFuncData.forEach(function(item, index) {
                this.jsonExtend(tmpParams[0], item);
              })
            }
          } catch (err) {

          }

          tmpParams = JSON.stringify(tmpParams);
          if (strCallWay === "WJyCallTql") {
            this.NcallTql(strFuncName, tmpParams, funcCallBack, {
              'jyflag': 1,
              'formid': formid
            });
          } else {
            this.NcallTql(strFuncName, tmpParams, funcCallBack, {
              'jyflag': 0,
              'formid': formid
            });
          }
        }
      } else {
        if (typeof paramsFuncData != 'string') {
          paramsFuncData = JSON.stringify(paramsFuncData);
        }


        this.NcallTql(strFuncName, paramsFuncData, funcCallBack, {
          'formid': formid,
          'Way': addWay,
          'pccef_method': addParObj.method || 'CallTQL'
        });
      }

    }

    if (this.tdxLog) {
      console.log([
        '发送请求:',
        '%c\n【' + strCallWay + '】请求详情，功能名-strFuncName: ' + strFuncName + '，入参-cparams：' + paramsFuncData,
        '%cobjOptParam: ' + JSON.stringify(objOptParam),
        '%c当前时间: ' + this.getCurTime(),
        ''
      ].join('\n'), 'color: green', 'color: red', 'color: green');
    }

  }

  /***json对象合并***/
  /**
   * @param  {object} destination 目标对象
   * @param  {object} source 源对象
   * @return {object} destination 合并到目标对象
   */
  jsonExtend(destination, source) {
    for (let property in source) {
      destination[property] = source[property];
    }
    return destination;
  }

  /***通用交易请求通道***/
  JYCallTql(entry, stream, pramObj, callback) {
    let objOptParam = {
      'sessionType': 'JYSession',
      'SessionID': pramObj.SessionID || ''
    };
    // alert(pramObj)
    let callWay = 'CallTQL';
    let addParObj = pramObj || {};
    // alert("ios"+JSON.stringify(stream))
    this.sendRequest(callWay, entry, stream, objOptParam, callback, addParObj);

  }

  /***交易Webview专属old请求通道***/
  WJyCallTql(entry, stream, pramObj, callback) {
    let objOptParam = {};
    let callWay = 'WJyCallTql';
    let addParObj = pramObj || {};
    this.sendRequest(callWay, entry, stream, objOptParam, callback, addParObj);
  }

  /****行情通道请求发送****/
  HQCallTql(entry, stream, pramObj, callback) {

    let objOptParam = {
      'sessionType': 'HQSession'
    };
    let callWay = 'CallTQL';
    let addParObj = pramObj || {};
    this.sendRequest(callWay, entry, stream, objOptParam, callback, addParObj);
  }

  /***服务FWSession请求发送***/
  FWCallTql(entry, stream, pramObj, callback) {

    let objOptParam = {
      'sessionType': 'FWSession',
      'SessionID': pramObj.SessionID || ""
    }
    let callWay = 'CallTQL';
    let addParObj = pramObj || {};
    this.sendRequest(callWay, entry, stream, objOptParam, callback, addParObj);
  }

  /***链接跳转调用/调用硬代码功能/枚举交易账号/唤起登陆界面***/
  WEBCallTql(entry, stream, callback) {
    let objOptParam = {
      'sessionType': stream.sessionType || '',
      'SessionID': stream.SessionID || ""
    }
    let callWay = 'WebCall';
    let addParObj = {};

    if (callback == '' || callback == undefined || typeof callback != 'function') {
      callback = function() {}
    }
    if (this.tdxMobSystem != "IOS" && this.tdxMobSystem != "Android" && this.tdxMobSystem != 'WEB-IOS' && this.tdxMobSystem != 'WEB-Android') {
      /*
       * 非app内部页面跳转支持（微信、浏览器）
       * */
      let streamObj = stream;
      if (typeof stream === 'string') {
        streamObj = JSON.parse(stream);
      }

      if (streamObj.hasOwnProperty('OpenUrl')) {

        let homePath = "/site/webApp/app/";
        let OpenName = streamObj.OpenName;
        let OpenUrl = streamObj.OpenUrl;
        let UrlType = streamObj.OpenParam.UrlType;
        let realUrl = OpenUrl;

        if (UrlType === "Absolute") {
          realUrl = homePath + OpenUrl;
        } else {
          // 取iframe中的路径，来计算出相对路径
          let curHref = window.location.href;
          let lastIndexSlash = curHref.lastIndexOf("/");
          realUrl = curHref.substring(0, lastIndexSlash + 1) + OpenUrl;
        }

        // 如果外层没有包裹页面，这里直接改变URL中的路径
        if (window.top === window) {
          window.location.href = realUrl;
        } else {
          parent.window.postMessage(JSON.stringify({
            OpenName: OpenName,
            OpenUrl: realUrl
          }), "*");
        }

      } else {
        if (this.tdxMobSystem === 'PCCEF') {
          addParObj.method = entry;
        }
        this.sendRequest(callWay, entry, stream, objOptParam, callback, addParObj);
      }

    } else {
      this.sendRequest(callWay, entry, stream, objOptParam, callback);
    }

  }

  // 唤起登录框
  /**
   * @param  {object} param 入参
   * @param  {Function} callback 回调函数
   * @return {[type]}
   */

  tdxLoginBox(param, callback) {

    if (this.tdxMobSystem == 'IOS' || this.tdxMobSystem == 'Android' || this.tdxMobSystem == 'WEB-IOS' || this.tdxMobSystem == 'WEB-Android') {
      callback = callback || param;

      let par = param;
      if (typeof param == 'function' || param == undefined) {
        par = {
          'HostType': '0'
        };
      }
      this.WEBCallTql('tdxLoginTrade', par, function(data) {
        callback(data);
      });
    } else if (this.tdxMobSystem == 'PC') {
      console.log('pc here');

    } else {
      // location.href = '';
      //纯浏览器
      this.WEBCallTql("tdxOpenUrl", {
        "OpenName": "登录",
        "OpenType": "native",
        "OpenUrl": "login/login.html",
        "OpenParam": {
          "UrlType": "Absolute"
        }
      }, function() {})
    }
  }

  /**
   * @param  {Function} callback 回调函数
   * @return {[type]}  账户列表
   */
  tdxgetAccList(callback) {

    if (this.tdxMobSystem == "IOS" || this.tdxMobSystem == "Android" || this.tdxMobSystem == "WEB-Android" || this.tdxMobSystem == "WEB-IOS") {


      this.WEBCallTql('tdxEnumTradeAcc', {}, function(data) {
        callback(data);
      });
    } else if (this.tdxMobSystem == "PCCEF") {
      this.TdxPcGetJyInfo(function(data) {
        callback(data);
      })
    } else {
      var uinfo = JSON.parse(localStorage.getItem("uinfo"));
      if (uinfo == null) {
        callback([]);
      } else {
        callback([JSON.stringify(uinfo)]);
      }
    }
  }

  /**
   * @param  {Function} callback 回调函数
   * @return {[type]}  自选股列表
   */
  tdxGetZxgList(callback) {
    this.WEBCallTql('tdxGetZxgList', {}, function(data) {
      callback(data);
    });
  }


  /**
   * @param  {Function} callback 回调函数
   * @return {[type]} TDXID [[0,"",0,"",0,""],["TDXID"],[]]
   */
  tdxGetPulTdxID(callback) {
    this.WEBCallTql('tdxGetPulTdxID', {}, function(data) {
      callback(data);
    });
  }

  /**
   * [tdxYhtLogin 唤起一户通登录框]
   */
  tdxYhtLogin(callback = function() {}) {
    this.WEBCallTql('tdxYhtLogin', {}, function(data) {
      callback(data);
    });
  }

 /**
   * [tdxYhtLogout 退出一户通登录]
   */
  tdxYhtLogout(callback = function() {}) {
    this.WEBCallTql('tdxYhtQuit', {}, function(data) {
      callback(data);
    });
  }



  /**
   * [tdxGetRegTel 获取注册手机号及一户通手机号]
   * @param {function} [callback] [回调函数]
   */
  tdxGetRegTel(callback) {
    this.WEBCallTql('tdxGetRegTel', {}, function(data) {
      callback(data);
    });
  }


  /**
   * [tdxGetTradeMarkInfo 获取交易监管留痕信息]
   * @param {function} [callback] [回调函数]
   */
  tdxGetTradeMarkInfo(callback) {
    this.WEBCallTql('tdxGetTradeMarkInfo', {}, function(data) {
      callback(data);
    });
  }

  //激活页面通知网页消息函数
  //window.tdxActivity(){
  // 开发自行定义该函数
  // }

  //唤起交易短信注册界面
  //无参数
  tdxGotoTradeMark() {
    this.WEBCallTql('tdxGotoTradeMark', {}, function(data) {
      // callback(data);
    });
  }


  /**手机表单调用键盘精灵
   * @param {object} param 入参示例：{'m_bFindSHSZ':1,'m_bFindQH':1, 'm_bFindHK':1,'m_bFindMG':1,'m_bFindALLOTHER':1}
   *                                  查找深沪市场,    查找期货市场,  查找港股市场, 查找美股市场, 查找其他             vlue 0 不启用/ 1 启用
   *@return {object}   回调  SETCODE,CODE 两个字段
   */
  tdxWebKeyboardElves(param, callback) {
    this.WEBCallTql('tdxWebKeyboardElves', param || {}, function(data) {
      callback(data);
    });
  }


  /**
   * [tdxOpenSearchDialog 唤起行情搜索界面]
   */
  tdxOpenSearchDialog() {
    this.WEBCallTql('tdxOpenSearchDialog', {}, function(data) {});
  }

  /**
   * [tdxSetCustomNavIcon 设置导航栏自定义按钮的图标]
   * @param {object} param {ItemID:'',Image:''}  //ItemID  对应uiconfig配置的节点id   Image  新图标的名称
   */
  tdxSetCustomNavIcon(param) {
    this.WEBCallTql('tdxSetCustomNavIcon', param || {}, function(data) {});
  }


  /**
   * [tdxGotoTradeMark 唤起交易短信注册界面]
   */
  tdxGotoTradeMark() {
    this.WEBCallTql('tdxGotoTradeMark', {}, function(data) {});
  }


  /**
   * [ReturnToSuperior 触发返回按钮]
   * @param {object or undefined} param  {"GotoRoot":1} 返还至首页 undefined 返回上一级
   */
  ReturnToSuperior(param) {
    let p = param || {};
    if (this.tdxMobSystem === 'IOS' || this.tdxMobSystem === 'WEB-IOS') {
      p.func = 'ReturnToSuperior';
    }
    this.WEBCallTql(p.func || 'ReturnToSuperior', p, function(data) {
      callback(data);
    });
  }

  /**
   * [tdxGetLocation 获得当前位置]
   * @param {function} [callback] [回调函数]
   * @return {json} 返回错误代码  0表示无错误  1表示权限错误，手机没有开启  2表示其他错误，无法定位
   *                返回数据是一个json  如下：{"latitude":"37.78583445","longitude":"122.40641749"}
   */
  tdxGetLocation(callback) {
    this.WEBCallTql('tdxGetLocation', {}, function(data) {
      callback(data);
    });
  }

  /**
   * [tdxCallTel 拨打电话]
   * @param {string} cellnumb 电话号码
   */
  tdxCallTel(cellnumb) {
    if (typeof cellnumb != 'string') {
      cellnumb = String(cellnumb);
    }
    this.WEBCallTql('tdxCallTel', {
      'PhoneNum': cellnumb
    }, function(data) {
      callback(data);
    });
  }

  /* 20181225 添加湘财原生支持的方法 */
  /**
   * [__callTel 拨打电话][ios]
   * @param {string} cellnumb 电话号码
   */
  xcCallTel(cellnumb) {
    if (typeof cellnumb != 'string') {
      cellnumb = String(cellnumb);
    }
    // var webCallTql = new WEBCallTql();
    this.WEBCallTql('XCSCCall', {
      openID:'CallTel',
      openParam:{
        "PhoneNum": cellnumb
      }
    }, function(data) {
      callback(data);
    });
  }

  /**
   * [tdxManipulateData 找回资金账号的接口]
   * @param {json} param {'account':content,'option':1}  account和option，account为要操作的数据，
   *                     比如电话号码，或者账号，option为操作类别，0复制到剪切板，1收藏数据到通讯录，2打开拨号盘,3 获取剪切板内容
   */
  tdxManipulateData(param,callback) {
    this.WEBCallTql('tdxManipulateData', param || {}, function(data) {
      callback(data);
    });
  }

  /**
   * [isLoginNormal 判断是当前激活交易账号否普通账户登录]
   * @param {function} [callback] [回调函数]
   */
  isLoginNormal(callback) {
    this.tdxgetAccList(function(data) {
      try {
        let curUser;
        if (typeof data == "string") { // ios
          data = JSON.parse(data);
          curUser = data[0];
        } else { // android
          curUser = JSON.parse(data[0] || {});
        }
      } catch (e) {}

      // 未登录或者当前账号不是普通账号
      if (data.length == 0 || curUser["HostType"] != 0) {
        callback(0);
      } else {
        callback(1);
      }
    })
  }


  /**
   * [tdxXgslReqHS 获取新股数量 沪深新股数量]
   * @param {function} [callback] [回调函数] 返回示例 {"SGSL": 2,"XGSL": 3,"ZQSL": 2}  //SGSL申购数量  XGSL 新股数量 ZQSL 中签数量
   */
  tdxXgslReqHS(callback) {
    this.WEBCallTql('tdxXgslReq', {
      Target: 0
    }, function(data) {
      callback(data);
    });

  }

  /**
   * [tdxXgslReqGG 获取新股数量 港股新股数量]
   * @param {function} [callback] [回调函数] 返回示例 {"SGSL": 2,"XGSL": 3,"ZQSL": 2}  //SGSL申购数量  XGSL 新股数量 ZQSL 中签数量
   */
  tdxXgslReqGG(callback) {
    this.WEBCallTql('tdxXgslReq', {
      Target: 1
    }, function(data) {
      callback(data);
    });

  }


  /*
   tdxFlushJYLockTime 延长交易锁屏时间
   */
  tdxFlushJYLockTime() {
    this.WEBCallTql('tdxFlushJYLockTime', {}, function(data) {});

  }

  //获取uinfo信息
  tdxGetUinfo(callback) {
    this.WJyCallTql('uinfo', [{
      "zjxx": 'loc'
    }], function(x, strFuncName, err, data) {
      callback(data);
    });
  }

  /**
   * [tdxGetYhtZhInfo 获取一户通账户信息]
   * @param {function} [callback] [回调函数]
   */
  tdxGetYhtZhInfo(callback) {
    this.WEBCallTql('tdxGetYhtZhInfo', {}, function(data) {
      callback(data);
    });

  }

  /**
   * [tdxGetEncryptAcc 新增加密接口]
   * @param {json} param  {EncryptType:0,EncryptedString:str}  0,des加密 1 AES加密
   * @param {function} callback  回调函数
   * @return {string} 返回加密串
   */
  tdxGetEncryptAcc(param, callback) {
    this.WEBCallTql('tdxGetEncryptAcc', param || {}, function(data) {
      callback(data);
    });
  }

  /**
   * [tdxOpenDialog 网页打开对话框]
   * @param {json} param 入参示例
   *                         [{'title':'提示','content':'hello,tdx !','buttons':[{'value':'取消','fun':'func1'},{'value':'确定','focus':true,'fun':'func2'}]}]
   * @return {string} 返回加密串
   */
  tdxOpenDialog(param) {
    this.WEBCallTql('tdxOpenDialog', {}, function(data) {});
  }

  /**
   * [tdxHideTopBar 隐藏顶部栏] 隐藏当前的顶部栏区域（注意：切换视图后顶部栏会自动恢复）
   */
  tdxHideTopBar() {
    this.WEBCallTql('tdxHideTopBar', {}, function(data) {});

  }

  /**
   * [tdxBottomBarVisibility 隐藏底部栏]
   * @param {int} flag 0:底部栏隐藏，1：底部栏显示
   */
  tdxBottomBarVisibility(flag) {
    this.WEBCallTql('tdxBottomBarVisibility', {
      'VisibilityFlag': flag || 1
    }, function(data) {
      callback(data);
    });

  }

  /**
   * [tdxOpenPwdDialog 弹出交易密码输入对话框 （港股有的网页操作前需要弹出密码框，要根据后台返回的标志判断是否弹框）]
   * 如果输入密码后点击确定，errFlag为0 返回一个密码替换串"passwordstr"，示例：[[0,"",1,"",0,""],["password"],[],["passwordstr"]]
   * 如果取消输入，errFlag为-1
   */
  tdxOpenPwdDialog(callback) {
    this.WEBCallTql('tdxOpenPwdDialog', {}, function(data) {
      callback(data);
    });

  }

  /**
   * [tdxQuitTrade 交易账号全部退出]
   */
  tdxQuitTrade(callback) {
    this.WEBCallTql('tdxQuitTrade', {}, function(data) {
      callback(data);
    });

  }

  /**
   * [tdxIsTradeLocked 判断交易是否锁定]
   * @param {function} callback  回调函数
   *     锁定返回1，[[0,"1",0,"",0,""],[],[]]
   *    未锁定返回0:[[0,"0",0,"",0,""],[],[]]
   */
  tdxIsTradeLocked(callback) {
    this.WEBCallTql('tdxIsTradeLocked', {}, function(data) {
      callback(data);
    });

  }

  /**
   * [tdxConfirmPay 支付请求确认]
   * @param {json} param  orderInfo和payType,orderInfo是字符串，payType是支付类型 {'orderInfo':'','payType':''}
   * @param {function} callback  回调函数
   */
  tdxConfirmPay(param, callback) {
    this.WEBCallTql('tdxConfirmPay', param || {}, function(data) {
      callback(data);
    });
  }

  /**
   * [tdxReFetchGDDM 刷新股东列表]
   * @param {function} callback  回调函数
   */
  tdxReFetchGDDM(callback) {
    this.WEBCallTql('tdxReFetchGDDM', {}, function(data) {
      callback(data);
    });
  }


  /**
   * [tdxOpenPDF 下载并打开PDF文档]
   * @param {json} param {"File":"下载的url"}
   */
  tdxOpenPDF(param) {
    this.WEBCallTql('tdxOpenPDF', param || {}, function(data) {});
  }

  /**
   * [tdxSetTopbarTitle 网页动态修改顶部栏标题]
   * @param {json} param {"Title":"xxx"}
   */
  tdxSetTopbarTitle(param) {
    this.WEBCallTql('tdxSetTopbarTitle', param || {}, function(data) {});
  }

  /**
   * [tdxChangeCurAcc 切换账号]
   * @param {json} param  {"SessionID":SessionID}
   */
  tdxChangeCurAcc(param) {
    this.WEBCallTql('tdxChangeCurAcc', param || {}, function(data) {});
  }


  /**
   * [tdxSetBadgeNum 设置iOS角标个数：]
   * @param {json} param  BadgeNum为iOS角标数字 {"BadgeNum":"1"}
   */
  tdxSetBadgeNum(param) {
    this.WEBCallTql('tdxSetBadgeNum', param || {}, function(data) {
      callback(data);
    });
  }


  /**
   * [tdxGotoAccountCenter 网页打开个人中心]
   */
  tdxGotoAccountCenter() {
    this.WEBCallTql('tdxGotoAccountCenter', {}, function(data) {});
  }



  /**
   * [tdxGetUIConfigInfo 获取服务器文件 ]
   * @param    {[type]}                 param    {"ItemID":"uiconfig中Item的ID"}
   * @param    {Function}               callback 返回 对应Item的uiconfig信息
   * @Author   tdxypf
   * @DateTime 2017-12-22T09:26:10+0800
   * @version  [1.0]
   */
  tdxGetUIConfigInfo(param, callback) {
    this.WEBCallTql('tdxGetUIConfigInfo', param, function(data) {
      callback(data);
    });
  }

  /**
   * [tdxStartScan 启动扫描]
   * @Author   tdxypf
   * @DateTime 2017-12-22T09:29:19+0800
   * @version  [1.0]
   */
  tdxStartScan() {
    this.WEBCallTql('StartScan', {}, function(data) {});
  }


  /**
   * [tdxSetStatusBarState 设置状态栏状态及颜色]
   * @param    {[type]}                 param {"ShowFlag":"0表示显示状态栏，1表示状态栏透明";"Color":"当ShowFlag为0时，传入Color可以改变状态栏颜色，若不传Color颜色默认为顶部栏背景色"}
   * @return   {[type]}                       [无]
   * @Author   tdxypf
   * @DateTime 2017-12-22T09:30:57+0800
   * @version  [1.0]
   */
  tdxSetStatusBarState(param) {
    this.WEBCallTql('SetStatusBarState', param || {}, function(data) {
      callback(data);
    });
  }

  /**
   * [tdxOpenSearchDialog 打开行情股票搜索框 ]
   * @Author   tdxypf
   * @DateTime 2017-12-22T09:32:32+0800
   * @version  [1.0]
   */
  tdxOpenSearchDialog() {
    this.WEBCallTql('tdxOpenSearchDialog', {}, function(data) {});
  }


  /**
   * [tdxGetXTSet 获取系统设置 ]
   * @param    {[type]}                 param    { SetType:[HqRefreshTime..] HqRefreshTime 行情刷新时间 }
   * @param    {Function}               callback 回调数据示例：[[0,"",1,"",0,""],["value"],[],["5"]]
   * @Author   tdxypf
   * @DateTime 2017-12-22T09:38:22+0800
   * @version  [1.0]
   */
  tdxGetXTSet(param, callback) {
    this.WEBCallTql('tdxGetXTSet', param, function(data) {
      callback(data);
    });
  }

  /**
   * [tdxAddZXG 添加自选股]
   * @param    {[type]}                 param {"StkInfo":json数组格式","GroupName":"分组名"}
   * @return   {[type]}                       [无]
   * @Author   tdxypf
   * @DateTime 2017-12-22T09:54:10+0800
   * @version  [version]
   */
  tdxAddZXG(param) {
    this.WEBCallTql('tdxAddZXG', param || {}, function(data) {
    });
  }

 tdxChangeSkin(param){
  this.WEBCallTql('tdxChangeSkin', param || {}, function(data) {
    });
 }



  /**********其他通用api************/
  /* * 应答格式化 * */
  FormatResult(data) {
    try {

      if (typeof data == 'string') {
        // data = data.replace(/\r\n/ig, "<br>");
        // data = data.replace(/\s/g, "");
        // data = data.replace(/&nbsp;/g, " ");
        data = JSON.parse(data);
      }

      let rt = {};
      rt.ErrorCode = data[0][0];
      rt.ErrorInfo = data[0][1];
      rt.Num = data[0][2];
      rt.Cookies = data[0][3];
      rt.POS = data[0][4];
	  rt.Head = data[2];
      if (rt.ErrorCode != 0) {
        return rt;
      }

      // 数据部分
      rt.rows = [];

      let titles = data[1];
      data.shift();
      data.shift();
      data.shift();

      rt.rows = data.reduce(function(prev, curr) {
        // 将扁平数组转换为对象
        prev.push(curr.reduce(function(p, c, index) {
          p[titles[index]] = c;
          return p;
        }, {}));
        return prev;
      }, []);

      return rt;

    } catch (e) {
      // alert('FormatResult，数据格式化失败。' +data);
      if (data.indexOf('[') < 0) {
        return {
          ErrorCode: -1,
          ErrorInfo: '系统请求失败<==错误信息：' + data
        };
      } else {
        return {
          ErrorCode: -1,
          ErrorInfo: '系统请求失败<==错误信息：' + e + ',' + data
        };

      }
    }
  }

  /**获取url参数**/
  getUrlParam(url) {
    let param = {};
    let index = url.indexOf("?");
    if (index == -1) {
      return param;
    }

    url = url.substr(index + 1);
    let queryArr = url.split("&");
    queryArr.forEach(function(p) {
      let a = p.split("=");
      param[a[0]] = a[1];
    })

    return param;
  }

}

const tc = new tdxConnect;
export default tc;


//激活页面通知网页消息函数
//function tdxActivity(){
// 开发自行定义该函数
// }



/***统一不同方式的回调函数***/
/**
 * @param  {[string]} formid 请求、回调统一标示
 * @param  {[string]} strFuncName 请求功能名称
 * @param  {[int]}    strErrNo  错误号
 * @param  {[string]} strResultCont  应答数据包
 * @return {[string]}
 */
window.tdxGetCallBack = function(formid, strFuncName, strErrNo, strResultCont) {
  if (tc.tdxLog) {
    console.log([
      '接受应答:',
      '%c\nWebCall请求详情，formid: [' + formid + ']，功能名-strFuncName：[' + strFuncName + ']',
      '%cstrErrNo：',
      '%c' + strErrNo,
      '%c应答结果：',
      '%c' + strResultCont,
      '%c当前时间: ' + tc.getCurTime(),
      ''
    ].join('\n'), 'color: green', 'color: red', 'color: gray', 'color: blue', 'color: gray', 'color: green');
  }


  if (formid.indexOf('_UrlEncode') > -1) {
    strResultCont = decodeURIComponent(strResultCont);
  }else if(formid.indexOf('_Base64') > -1){

     strResultCont = tdxBsc.base64Decode(strResultCont);
  }

  if (strErrNo != 0) {
    strResultCont = JSON.stringify([
      [strErrNo, strResultCont, '', '', ''],
      [],
      []
    ]);
    if (strErrNo == '-10000') {
      tc.tdxLoginBox();
      strResultCont = JSON.stringify([
        [0, strResultCont, 0, "", ''],
        [],
        []
      ]);
    }
  }

  if (tc.tdxCallBackFuncObj.hasOwnProperty(formid)) {
    let callback = tc.tdxCallBackFuncObj[formid];
    tc.tdxCallBackFuncObj[formid] = undefined;
    delete tc.tdxCallBackFuncObj[formid];
    callback(strResultCont);
  }
}


/**
 *参数说明
 *
 * [webCall OpenURL 新增入参]
 * OpenParam添加参数：
 * PullMode为0表示禁用下拉刷新，默认不添加时启用下拉刷新
 * NoTopBarFlag为1禁用硬代码的topbar
 * PinWebTopBar为1用于网页用输入弹出键盘时固定住网页的topbar
 *
 *
 *
 *
 *
 *
 */
