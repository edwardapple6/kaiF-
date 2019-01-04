import tdxct from '../../src/lib/connect'
function Reback(){
    if (tdxct.tdxMobSystem == "WEB-Android" || tdxct.tdxMobSystem == "Android") {
        window.onback = function() {
          var params = {
            JumpPageID: "Trade.Stock"
          };
          console.log(111);
          tdxct.WEBCallTql("tdxJumpPage", JSON.stringify(params), "", "");
          // alert(22222);
        };
        tdxct.WEBCallTql("tdxRegWebBackFunc", { BackFunc: "onback" }, data => {});
      }else if(tdxct.tdxMobSystem == "WEB-IOS" || tdxct.tdxMobSystem == "IOS"){
        // alert(111)
        window.onback = function() {
          var params = {
            JumpPageID: "Trade.Stock"
          };
          console.log(111);
          tdxct.ReturnToSuperior({"GotoRoot":1})
          // alert(22222);
        };
        tdxct.WEBCallTql("tdxRegWebBackFunc", { BackFunc: "onback" }, data => {});
        
      }
}

export { //添加export抛出模块
    Reback
  }