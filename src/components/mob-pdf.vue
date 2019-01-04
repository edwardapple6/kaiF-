<template>
  <div @change="change">
    <canvas v-for="page in pages" :id="'the-canvas'+page" :key="page"></canvas>
    <div id="hb"></div>
    <!-- <div v-show='alertShow' class="alertMsg"><img class="alertLoading" src="../../static/loading.gif" alt=""></div> -->
    <div v-show="alertShow" class="alertMsg01">
      <img class="alertLoading" src="../../static/loading.gif" alt>
      <p class="progress">
        <span>已加载：</span>
        <span>{{loadNum}}%</span>
      </p>
    </div>
    <div class="back" v-show="isShow">
      <!-- 弹窗 info -->
      <div class="dialog">
        <div class="title">{{ Alerttitle }}</div>
        <div class="content" v-html="content"></div>
        <div class="button" @click="btnClicked">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
let PDFJS = require("pdfjs-dist");
PDFJS.workerSrc = require("pdfjs-dist/build/pdf.worker.entry");
import tdxct from "../lib/connect.js";
const Base64 = require("js-base64").Base64;

export default {
  props: ["acceptData", "F1284", "hc_data", "isKhfirst"],
  name: "pdf-component",
  data() {
    return {
      title: "查看确认书",
      pdfDoc: null,
      pages: 0,
      alertShow: true,
      isShow: false,
      content: "",
      loadNum: 0,
      num: 0,
      Num: 1,
      Alerttitle: "温馨提示",
      pageSum: 1
    };
  },
  created() {
    console.log(111);
  },
  methods: {
    _renderPage(num) {
      var __ = this;
      __.pdfDoc.getPage(num).then(page => {
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
        __.alertShow = false;

        if (__.pages > num) {
          __._renderPage(num + 1);
        } else {
          __.change();
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
    // _renderPage(num, length) {
    //   var __ = this;
    //   // alert('第一步')
    //   __.pdfDoc.getPage(num).then(page => {
    //     // alert('第二步')
    //     let canvas = document.getElementById("theCanvas" + num);
    //     console.log(canvas);
    //     let ctx = canvas.getContext("2d");
    //     let dpr = window.devicePixelRatio || 1;
    //     let bsr =
    //       ctx.webkitBackingStorePixelRatio ||
    //       ctx.mozBackingStorePixelRatio ||
    //       ctx.msBackingStorePixelRatio ||
    //       ctx.oBackingStorePixelRatio ||
    //       ctx.backingStorePixelRatio ||
    //       1;
    //     let ratio = dpr / bsr;
    //     let viewport = page.getViewport(
    //       screen.availWidth / page.getViewport(1).width
    //     );
    //     canvas.width = viewport.width * ratio;
    //     canvas.height = viewport.height * ratio;
    //     canvas.style.width = viewport.width + "px";
    //     canvas.style.height = viewport.height + "px";
    //     ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    //     let renderContext = {
    //       canvasContext: ctx,
    //       viewport: viewport
    //     };

    //     page.render(renderContext);
    //     if (__.pages > length) {
    //       //如果pdf的页数大于传值过来的length，说明需要多次渲染，第一次渲染的时候就把倒计时打开
    //       if (length > num) {
    //         __._renderPage(num + 1, length);
    //         __.isNext = true;
    //       } else {
    //         __.alertShow = false;
    //         __.pageSum = length;
    //       }
    //     } else if (length > __.pages && length > 10) {
    //       //当传值过来的length大于pdf的页数并且大于10时，说明最后部分已经不足10个画布了（避免页数小于10的时候有多余的空白画布）
    //       if (__.pages > num) {
    //         __._renderPage(num + 1);
    //       } else {
    //         __.isNext = false;
    //         __.alertShow = false;
    //         __.change();
    //       }
    //     } else {
    //       //该情景是pdf页数不超过10
    //     // alert('第三步')
          
    //       if (__.pages > num) {
    //         __._renderPage(num + 1);
    //       } else if (__.pages == 1) {
    //     // alert('第四部')
            
    //         //当pdf页数时1的时候，去除其余的空白画布
    //         __.isNext = false;
    //         __.alertShow = false;
           
    //         for (var i = 2; i <= 10; i++) {
    //           console.log(i);
    //           $("#theCanvas" + i).remove();
    //         }
    //          __.change();
    //         // alert($("#theCanvas1"))
    //       } else {
    //         //当页数大于1且小于10的时候
    //         __.isNext = false;
    //         __.alertShow = false;
    //         __.change();
    //         for (var i = __.pages + 1; i <= 10; i++) {
    //           console.log(i);
    //           $("#theCanvas" + i).remove();
    //         }
    //       }
    //     }
    //   });
    // },
    // _loadFile(data, num, length) {
    //   // alert('第四步')
    //   console.log(data)
    //   console.log(num)
    //   console.log(length)
    //   let that01 = this;
    //   PDFJS.getDocument({
    //     data: data,
    //     cMapUrl: "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.0.288/cmaps/",
    //     cMapPacked: true
    //   }).then(pdf => {
    //     // alert("第五步")
    //     that01.pdfDoc = pdf;
    //     that01.pages = that01.pdfDoc.numPages;
    //     that01.$nextTick(() => {
    //       console.log(num);
    //       that01._renderPage(num, length);
    //     });
    //   });
    // },
    change() {
      this.$emit("HasShow", true);
    },
    getBase64Data(base64Str, strPOS, jjgs, gsdm, paramcode, protocode, f1284) {
      let _self = this;
      if (strPOS === "original") {
        strPOS = "";
        var params = [
          {
            F362: paramcode,
            F1217: protocode,
            F1286: strPOS,
            F1288: "60",
            F1284: f1284,
            F391: jjgs,
            F393: gsdm
          }
        ];
        console.log(params);
        tdxct.JYCallTql("198", params, { Way: "qs" }, function(data) {
          var result_pdf01 = tdxct.FormatResult(data);
          if (
            result_pdf01.rows[0].F1223 == "4" ||
            result_pdf01.rows[0].F1223 == "1"
          ) {
            var errorinfo = "";
            errorinfo = result_pdf01.rows[0].F149.split("{T}");
            _self.alertShow = false;
            _self.isShow = true;
            _self.content = errorinfo[3];
          } else {
            var arr = result_pdf01.POS;
            arr = arr.split("@");
            _self.Num = 1;
            _self.num = Math.floor(100 / arr[2]);
            _self.loadNum = _self.num;

            base64Str += result_pdf01.rows[0].F149;
            strPOS = result_pdf01.POS;
            _self.getBase64Data(
              base64Str,
              strPOS,
              jjgs,
              gsdm,
              paramcode,
              protocode,
              f1284
            );
          }
        });
      } else if (strPOS && strPOS != "original") {
        var param_2 = [
          {
            F362: paramcode,
            F1217: protocode,
            F1286: strPOS,
            F1288: "60",
            F1284: f1284,
            F391: jjgs,
            F393: gsdm
          }
        ];
        console.log(param_2);
        tdxct.JYCallTql("198", param_2, { Way: "qs" }, function(data) {
          _self.Num++;
          _self.loadNum = _self.num * _self.Num;
          console.log(tdxct.FormatResult(data));
          base64Str += tdxct.FormatResult(data).rows[0].F149;
          strPOS = tdxct.FormatResult(data).POS;
          _self.getBase64Data(
            base64Str,
            strPOS,
            jjgs,
            gsdm,
            paramcode,
            protocode,
            f1284
          );
        });
      } else {
        // _self.pdfDoc = atob(base64Str);
        // if (
        //   _self.pdfDoc == "" ||
        //   _self.pdfDoc == null ||
        //   _self.pdfDoc == undefined
        // ) {
        //   _self.isShow = true;
        //   _self.content = "获取文件失败，请稍后再试...";
        // }
        // for (var i = 1; i <= 10; i++) {
        //   if (i >= 1 && i <= 10) {
        //     $("#hb").append(
        //       "<canvas id=" + '"' + "theCanvas" + i + '"' + "></canvas>"
        //     );
        //   }
        // }
        // console.log(_self.loadNum);
        // _self._loadFile(_self.pdfDoc, _self.pageSum, _self.pageSum + 9);
        _self.Num++;
        _self.loadNum = 100;
        _self.pdfDoc = atob(base64Str);
        // console.log(_self.pdfDoc)
        _self._loadFile(_self.pdfDoc);
        // _self.change()
      }
    },
    btnClicked() {
      this.isShow = false;
    }
  },
  mounted() {
    document.title = this.title;
    console.log(this.acceptData[1]);

    // this.getBase64Data(base64Str,strPOS)
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
  top: 40%;
  left: 50%;
  height: 50px;
  width: 50px;
  margin-left: -25px;
}
.progress {
  position: absolute;
  top: 50%;
  left: 0;
  color: #fd671a;
  width: 100%;
  text-align: center;
}
.back {
  position: fixed;
  top: 0%;
  left: 0%;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1001;
}
.dialog {
  position: fixed;
  top: 30%;
  left: 50%;
  width: 280px;
  margin-left: -140px;
  background-color: white;
  border-radius: 5px;
  z-index: 1002;
  text-align: center;
}
.title {
  line-height: 44px;
  font-size: 18px;
  color: #333;
}
.content {
  line-height: 24px;
  font-size: 14px;
  text-align: center;
  padding: 10px 15px;
  color: #666;
  border-bottom: #f0f0f0 1.5px solid;
  word-break: break-all;
}
.button {
  line-height: 44px;
  font-size: 16px;
  color: #fd671a;
}
.button:active {
  background-color: #f0f0f0;
}
</style>