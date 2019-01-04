<template>
  <div class="plLoading">
    <div class="plLoadingContent">
      <!-- <div class="plLoadingLogo">
        <img src="http://static.crecgec.com/Kaipiao/loadingLogo.png"/>
      </div> -->
      <div class="plLoadingCon">
        <div class="plLoadingShow" ref="plLoadingShow" :style="{width: plsStyleWidth}"></div>
        <div class="plLoCir" ref="plLoCir" :style="{left: plcStyleLeft}" v-show="plcShow"></div>
      </div>
      <div class="plLoadingNum" ref="plLoadingNum">0%</div>
    </div>
    <!--测试用的，使用的时候，在父组件创建一个隐藏的Ddiv，里面放入这个页面用到的所有img-->
    <div class="imgsHidden displayNone">
      <!-- <img class="hImg" src="http://static.crecgec.com/Kaipiao/countDownTitle.png"> -->
      <img class="hImg" src="http://static.crecgec.com/Kaipiao/countDown.png">
      <img class="hImg" src="http://static.crecgec.com/Kaipiao/countDown1.png">
      <!-- <img class="bImg" src="http://static.crecgec.com/Kaipiao/background.png"> -->
      <!-- <img class="hImg" src="http://static.crecgec.com/Kaipiao/loadingLogo.png"> -->
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import $ from 'jquery'

  export default {
    props: {
      eleH: {
        type: String,
        default: 'hImg'
      },
      eleB: {
        type: String,
        default: 'bImg'
      },
      dataIsOk: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        plsStyleWidth: 0, // plLoadingShow的初始width
        plcStyleLeft: 0, // plLoCir的初始left值
        plcShow: true, // plLoCir初始是显示状态
        backImgLoading: false, // 背景图片是否加载成功(40)
        otherImgLoading: false, // 头部、底部图片加载成功(40)
        dataLoading: '', // 后台返回的数据加载成功(20)
        lodingWidth: 0,
        otherImgLength: 0,
        otherNum: 0,
        backImgLength: 0,
        backNum: 0,
        screenWidth: document.body.clientWidth, // 屏幕尺寸
      }
    },
    watch: {
      // 整个也没被分为三部分：背景图、其他图片、数据
      // 监控otherImgLoading，（其他图片加载成功），this.lodingWidth增加40
      otherImgLoading () {
        this.lodingWidth = this.lodingWidth + 40
      },
      // 监控otherImgLoading，（背景图片加载成功），this.lodingWidth增加40
      backImgLoading () {
        this.lodingWidth = this.lodingWidth + 40
      },
      // 监控dataIsOk，（数据加载成功，这个有父组件传递过来），this.lodingWidth增加20
      dataIsOk () {
        if (this.dataIsOk) {
          this.lodingWidth = this.lodingWidth + 20
        }
      },
      // 监控lodingWidth的值
      lodingWidth () {
        if (this.lodingWidth <= 100) {
          this.setLoadingWidthTimer(this.lodingWidth)
        }
      },
      // 监控plcStyleLeft（圆球的left值），如果值为484px（自己设置的），表明圆球到了最右边
      // 圆球隐藏
      plcStyleLeft () {
        if (this.plcStyleLeft === '484px') {
          setTimeout(() => {
            this.plcShow = false
            this.hasScroll()
            this.$emit('tipShow', {loadingIsShow: false})
          }, 500)
        }
      }
    },
    mounted () {
      this.isOtherImgLoading(this.eleH)
      this.isBackImgLoading(this.eleB)
      this.noScroll()
      const that = this
      window.onresize = () => {
        return (() => {
          window.screenWidth = document.body.clientWidth
          that.screenWidth = window.screenWidth
        })()
      }
    },
    methods: {
      // 设置width、left
      setLoadingWidthTimer (newPllsWidth) {
        if (newPllsWidth <= 40) {
          setTimeout(() => {
            this.plsStyleWidth = (500 * newPllsWidth / 100) + 'px'
            this.plcStyleLeft = (475 * newPllsWidth / 100) + 'px'
            this.$refs.plLoadingNum.innerHTML = newPllsWidth + '%'
          }, 500)
        } else if (newPllsWidth <= 80) {
          setTimeout(() => {
            this.plsStyleWidth = (500 * newPllsWidth / 100) + 'px'
            this.plcStyleLeft = (484 * newPllsWidth / 100) + 'px'
            this.$refs.plLoadingNum.innerHTML = newPllsWidth + '%'
          }, 1000)
        } else {
          setTimeout(() => {
            this.plsStyleWidth = (500 * newPllsWidth / 100) + 'px'
            this.plcStyleLeft = (484 * newPllsWidth / 100) + 'px'
            this.$refs.plLoadingNum.innerHTML = newPllsWidth + '%'
          }, 1500)
        }
      },
      // 弹出层显示的时候，没有滚动条
      noScroll () {
        document.body.style.cssText = 'overflow:hidden;'
      },
      // 弹出层消失后，滚动条显示
      hasScroll () {
        document.body.style.cssText = 'overflow:auto;'
      },
      isOtherImgLoading (ele) {
        this.otherImgLength = $('.' + ele).length
        let _this = this
        if (this.otherImgLength > 0) {
          $('.' + ele).each(function () {
            $(this).on('load', function () {
              _this.otherNum = _this.otherNum + 1
              if (_this.otherImgLength === _this.otherNum) {
                _this.otherImgLoading = true
              }
            })
          })
        } else {
          this.otherImgLoading = true
        }
      },
      isBackImgLoading (ele) {
        this.backImgLength = $('.' + ele).length
        let _this = this
        if (this.backImgLength > 0) {
          $('.' + ele).each(function () {
            $(this).on('load', function () {
              _this.backNum = _this.backNum + 1
              if (_this.backImgLength === _this.backNum) {
                _this.backImgLoading = true
              }
            })
          })
        } else {
          this.backImgLoading = true
        }
      }
    }
  }
</script>

<style>
  .plLoading{
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 100;
    background-color: #00101d;
  }
  /* .plLoadingContent{
    width: 100%;
    height: 220px;
    position: absolute;
    margin: 0 auto;
    top: 50%;
    left: 0;
    margin-top: -110px;
    margin-left: -50%;
  } */
  .plLoadingLogo{
    height: 60px;
  }
  .plLoadingCon{
    width: 100%;
    height: 16px;
    margin-top: 100px;
    border-radius: 8px;
    background-color: #222222;
  }
  .plLoadingShow{
    transition: width .5s;
    height: 16px;
    border-radius: 8px;
    background-color: #0062b2;
    position: absolute;
  }
  .plLoCir{
    transition: left .5s;
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 8px;
    background-color: #0062b2;
    box-shadow: 0 0 20px #008cff;
  }
  .plLoadingNum{
    font-size: 14px;
    color: #0062b2;
    margin-top: 20px;
  }
  .displayNone{
    display: none;
  }
</style>