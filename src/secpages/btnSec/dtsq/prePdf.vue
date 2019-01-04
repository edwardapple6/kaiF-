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
      :mobSys="mobSys"
      :title="dlgInfo.title"
      :content="dlgInfo.content"
      @info-btn01="infoBtn01"/>
    <!-- 加载提示 -->
    <pctLoading v-if="pctLoading.open"
      :pct="pctLoading.pct"/>
  </div>
</template>

<script>
/* eslint-disable */
import config from "../../../lib/config.js"
import tdxct from "../../../lib/connect.js"
import dlgInfo from '../../../components/dlgInfo'
import pctLoading from '../../../components/pctLoading'

// import PDFJS from "pdfjs-dist"
let PDFJS = require('pdfjs-dist');
PDFJS.workerSrc = require('pdfjs-dist/build/pdf.worker.entry');

export default {
  name: "pdf",
  components: {
    dlgInfo,
    pctLoading
  },
  props: ['F362', 'mobSys', 'pdfInfo'],
  data() {
    return {
      // F362: 'Mobile.Stock.kfsjj.jjdtsq',

      // pdfInfo: {
      //   open: false,
      //   F149: '', // 获取请求 'PDF' 的 F1217
      //   F1217: '', // 获取 '签署' 的 F1217
      //   F1223: '', // 获取检查风险标志
      //   F1284: '', // 获取 F1284
      // },
      F1217Arr: [],
      temF1217: '',

      dlgInfo: {
        open: false,
        title: '',
        content: ''
      },
      pctLoading: {
        open: false,
        pct: ''
      },

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
  created() {},
  mounted() {
    this.F1217Arr = this.pdfInfo.F149.split('{T}')[2].split(';').slice(0, 3)
    this.temF1217 = this.F1217Arr[0]

    this.get198Data(this.temF1217) // first PDF
  },
  methods: {
    isRead () {
      if (this.F1217Arr[2] !== this.temF1217) {
        for (let i in this.F1217Arr) {
          if (this.F1217Arr[i] === this.temF1217 && i < this.F1217Arr.length - 1) {
            this.temF1217 = this.F1217Arr[parseInt(i) + 1]
            /* 初始化 */
            this.POS198 = ''
            this.req198 = 0
            this.base64Str = ''
            this.readBtn.disabled = true
            this.get198Data(this.temF1217)
            break
          }
        }
      } else {
        this.sign198()
      }
    },
    sign198 () {
      const _self = this
      this.loading = true
      let param198 = [{
        'F362': this.F362,
        'F1217': this.pdfInfo.F1217,
        'F1284': this.pdfInfo.F1284
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
              _self.$emit('pdf-all-read', true) // 打开dos
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
          scrollTo(0, 0)
        }
      });
    },
    _loadFile(url) {
      PDFJS.getDocument({
        data: url,
        cMapUrl: "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.0.288/cmaps/",
        // cMapUrl: cmaps,
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
    get198Data (temF1217) {
      const _self = this
      this.pctLoading.open = true
      if (this.req198 === 0) {
        this.pctLoading.pct = '0%'
      } else {
        this.pctLoading.pct = Math.round(this.req198 / this.totalReq198 * 100) + '%'
      }
      let param198 = [{
        'F362': this.F362,
        'F1217': temF1217,
        'F1284': this.pdfInfo.F1284,
        'F1286': this.POS198,
        'F1288': 400
      }]
      if (this.mobSys === 'IOS' || this.mobSys === 'WEB-IOS') param198['tdxPageID'] = '_Base64'
      if (this.req198 === 0) {
        console.log('申请PDF', temF1217)
        console.log('param198', param198)
      }
      tdxct.JYCallTql('198', param198, { Way: 'qs' }, function (data) {
        _self.pctLoading.open = false
        let data198 = tdxct.FormatResult(data)
        let rows198 = data198.rows
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
        if (_self.POS198 && _self.req198 !== -1) _self.get198Data(temF1217)
        if (!_self.POS198 && _self.req198 > 0 && _self.F1223 !== '4') {
          _self._loadFile(atob(_self.base64Str));
        }
      })
    },
    infoBtn01 (infoBtn01) {
      this.dlgInfo.open = infoBtn01
      /* F1223 TDX_ID_XT_CHECKRISKFLAG 检查风险标志 */
      if (this.F1223 === '4') {
        tdxct.WEBCallTql('ReturnToSuperior', '', '') // 返回上一级页面
      }
      if (this.req198 === -1) this.get198Data(this.temF1217)
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
