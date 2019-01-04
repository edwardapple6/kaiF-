<template>
  <div class="pdf">
    <canvas v-for="page in pages"
      :key="page"
      :id="'the-canvas'+ page"></canvas>

    <div v-show="readBtn.show"
      class="read-btn"
      :class="readBtn.disabled ? 'unread-btn' : 'is-read-btn'"
      :disabled="readBtn.disabled"
      @click="isRead">{{ readBtn.msg }}</div>

    <dlgInfo v-if="dlgInfo.open"
      :title="dlgInfo.title"
      :content="dlgInfo.content"
      @info-btn01="infoBtn01"/>
    <!-- 加载提示 -->
    <pctLoading v-if="pctLoading.open"
      :pct="pctLoading.pct"/>
    <loading v-if="loading"/>
  </div>
</template>

<script>
/* eslint-disable */
import config from "../../lib/config.js"
import tdxct from "../../lib/connect.js"
import dlgInfo from '../../components/dlgInfo'
import pctLoading from '../../components/pctLoading'
import loading from '../../components/loading'

// import PDFJS from "pdfjs-dist"
let PDFJS = require('pdfjs-dist');
PDFJS.workerSrc = require('pdfjs-dist/build/pdf.worker.entry');

export default {
  name: "pdf",
  components: {
    dlgInfo,
    pctLoading,
    loading
  },
  data() {
    return {
      // localStorage
      myTemPdfInfo: {
        // 'F362': temF362,
        // 'F391': _self.items[0].value, // 产品代码
        // 'F393': _self.wantInfo.F426, // 产品公司代码
        // 'F149': data198B.rows[0].F149, // 获取请求 'PDF' 的 F1217
        // 'F1217': data198B.rows[0].F1217, // 获取 '签署' 的 F1217
        // 'F1223': data198B.rows[0].F1223, // 获取检查风险标志
        // 'F1284': data198B.rows[0].F1284 // 获取 F1284
      },
      pdfF1217: '', // 通过 localStorage F149 获取

      dlgInfo: {
        open: false,
        title: '',
        content: ''
      },
      pctLoading: {
        open: false,
        pct: ''
      },
      loading: false,

      pdfDoc: null,
      pages: 0,
      alertShow: true,

      F1223: '', // TDX_ID_XT_CHECKRISKFLAG 检查风险标志
      POS198: '',
      req198: 0,
      totalReq198: '',
      base64Str: '',
      readBtn: {
        show: false,
        disabled: true,
        msg: ''
      }
    };
  },
  created() {
    window.setPartHeight = function () {}
    window.changeFontSize = function () {}
  },
  mounted() {
    const temObj = JSON.parse(localStorage.getItem('myTemPdfInfo'))
    this.myTemPdfInfo = temObj
    console.log('myTemPdfInfo', temObj)
    this.pdfF1217 = this.myTemPdfInfo.F149.split('{T}')[2].split(';')[0]
    this.signF1217 = this.myTemPdfInfo.F1217
    this.F1223 = this.myTemPdfInfo.F1223
    localStorage.removeItem('myTemPdfInfo')
    this.get198Data()
  },
  methods: {
    isRead () {
      this.sign198()
    },
    sign198 () {
      const _self = this
      this.loading = true
      let param198 = [{
        'F362': this.myTemPdfInfo.F362,
        'F391': this.myTemPdfInfo.F391,
        'F393': this.myTemPdfInfo.F393,
        'F1217': this.myTemPdfInfo.F1217,
        'F1284': this.myTemPdfInfo.F1284
      }]
      if (this.mobSys === 'IOS' || this.mobSys === 'WEB-IOS') param198['tdxPageID'] = '_Base64'
      console.log('param198', param198)
      tdxct.JYCallTql('198', param198, { Way: 'qs' }, function (data) {
        _self.loading = false
        let data198 = tdxct.FormatResult(data)
        console.log('data198', data198)
        switch (data198.ErrorCode) {
          /* 安卓解析 -1，IOS解析 '-1' */
          case -1:
          case '-1':
            _self.dlgInfo.open = true
            _self.dlgInfo.title = '提示'
            _self.dlgInfo.content = data198.ErrorInfo
            _self.req198 = -1
            break
          case '0':
            if (data198.Num === '1' && data198.rows[0].F1223 === '4') {
              _self.F1223 = data198.rows[0].F1223
              _self.dlgInfo.open = true
              _self.dlgInfo.title = '提示'
              _self.dlgInfo.content = '本次协议签署失败，可能是因为您的资料中关键信息缺失，请到营业部或致电我司统一客服热线95351进行处理!'
            } else { // data198.Num === 0 ???
              /* 跳转到页面，并通讯页面 已同意 */
              localStorage.setItem('myTemIsReadInfo', true)
              tdxct.WEBCallTql('ReturnToSuperior', '', '') // 返回上一级页面
            }
            break
        }
      })
    },
    _renderPage(num) {
      var _self = this;
      this.pdfDoc.getPage(num).then(page => {
        let canvas = document.getElementById("the-canvas" + num);
        let ctx = canvas.getContext("2d");
        let dpr = window.devicePixelRatio || 1;
        let bsr =
          ctx.webkitBackingStorePixelRatio ||
          ctx.mozBackingStorePixelRatio ||
          ctx.msBackingStorePixelRatio ||
          ctx.oBackingStorePixelRatio ||
          ctx.backingStorePixelRatio ||
          1;
        let ratio = dpr / bsr;
        let viewport = page.getViewport(
          screen.availWidth / page.getViewport(1).width
        );
        canvas.width = viewport.width * ratio;
        canvas.height = viewport.height * ratio;
        canvas.style.width = viewport.width + "px";
        canvas.style.height = viewport.height + "px";
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        let renderContext = {
          canvasContext: ctx,
          viewport: viewport
        };
        page.render(renderContext);
        _self.alertShow = false;

        if (_self.pages > num) {
          _self._renderPage(num + 1);
        } else {
          _self.changeBtn();
        }
      });
    },
    _loadFile(url) {
      PDFJS.getDocument({
        data: url,
        cMapUrl: "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.0.288/cmaps/",
        cMapPacked: true
      }).then(pdf => {
        this.pdfDoc = pdf;
        this.pages = this.pdfDoc.numPages;
        this.$nextTick(() => {
          this._renderPage(1);
        });
      });
    },
    changeBtn () {
      let temTime = config.time
      let temObj = this.readBtn
      temObj.show = true
      let clock = setInterval(() => {
        if (temTime !== 0) temObj.msg = "请仔细阅读上述协议(" + temTime + "s)";
        if (temTime == 0) {
          temObj.msg = "我已阅读并同意";
          temObj.disabled = false;
          clearInterval(clock);
        }
        temTime--
      }, 1000);
    },
    /* 198B  获取 base64 字符串 */
    get198Data () {
      const _self = this
      this.pctLoading.open = true
      if (this.req198 === 0) {
        this.pctLoading.pct = '0%'
      } else {
        this.pctLoading.pct = Math.round(this.req198 / this.totalReq198 * 100) + '%'
      }
      let param198 = [{
        'F362': this.myTemPdfInfo.F362,
        'F391': this.myTemPdfInfo.F391,
        'F393': this.myTemPdfInfo.F393,
        'F1217': this.pdfF1217,
        'F1284': this.myTemPdfInfo.F1284,
        'F1286': this.POS198,
        'F1288': 400
      }]
      if (this.mobSys === 'IOS' || this.mobSys === 'WEB-IOS') param198['tdxPageID'] = '_Base64'
      console.log('param198', param198)
      tdxct.JYCallTql('198', param198, { Way: 'qs' }, function (data) {
        _self.pctLoading.open = false
        let data198 = tdxct.FormatResult(data)
        console.log('data198', data198)
        switch (data198.ErrorCode) {
          /* 安卓解析 -1，IOS解析 '-1' */
          case -1:
          case '-1':
            _self.dlgInfo.open = true
            _self.dlgInfo.title = '提示'
            _self.dlgInfo.content = data198.ErrorInfo
            _self.req198 = -1
            break
          case '0':
            _self.F1223 = data198.rows[0].F1223
            switch (data198.rows[0].F1223) {
              case '0':
              case '1':
              case '2':
              case '3':
              case '4':
                _self.dlgInfo.open = true
                _self.dlgInfo.title = '提示'
                _self.dlgInfo.content = data198.rows[0].F149.split('{T}')[3]
                break
            }
            _self.POS198 = data198.POS
            _self.req198++
            if (_self.req198 === 1) _self.totalReq198 = data198.POS.split('@').pop()
            _self.base64Str += data198.rows[0].F149
            break
        }
        if (_self.POS198 && _self.req198 !== -1) _self.get198Data()
        if (!_self.POS198 && _self.req198 > 0 && _self.F1223 !== '4') {
          _self._loadFile(atob(_self.base64Str));
        }
      })
    },
    infoBtn01 (infoBtn01) {
      this.dlgInfo.open = infoBtn01
      /* F1223 TDX_ID_XT_CHECKRISKFLAG 检查风险标志 */
      if (this.F1223 === '4') {
        /* 返回上一级页面 */
        tdxct.WEBCallTql('ReturnToSuperior', '', '')
      }
    }
  }
};
</script>

<style scoped>
canvas {
  display: block;
  /* border-bottom: 1px solid black; */
  width: 100%;
  /* margin-bottom:190px; */
}
.alertMsg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* line-height: 520px; */
  text-align: center;
  font-size: 20px;
  color: #999;
  background-color: rgba(0, 0, 0, 0.3);
}
.alertLoading {
  position: absolute;
  top: 50%;
  left: 50%;
  height: 50px;
  width: 50px;
  margin-left: -25px;
  margin-top: -25px;
}
.read-btn {
  display: block;
  outline: none;
  border: none;
  font-size: 15px;
  margin: 40px 15px;
  height: 40px;
  line-height: 40px;
  height: 40px;
  text-align: center;
  color: #fff;
  border-radius: 5px;
}
.unread-btn {
  background-color: #ffb48d;
  pointer-events: none;
}
.is-read-btn {
  background-color: #fd671a;
}

</style>

<style>
/* 去掉 iphone 默认半透明点击效果 */
* {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  margin: 0;
  padding: 0;
}
.ios {
  border-width: 1px;
}
.android {
  border-width: 1.5px;
}
/*清除浮动*/
.clearfix:after{content:""; display:block; clear:both;}
.clearfix{zoom:1;}
</style>
