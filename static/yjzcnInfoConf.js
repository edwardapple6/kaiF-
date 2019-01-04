/* 配置一些全局变量 */
'use strict'
/* 一键转场内提示信息：客户端配置 */
window.infoConf = {
  firInfo: '暂不支持向其他证券经营机构转托管。',
  riskInfo: '请确保场外基金账户对应的场内证券账户不存在已注销或状态异常等情形，否则存在转托管失败的风险。如需帮助，请咨询湘财证券客服中心95351。'
}

/* 一键转场内提示信息：后台配置 */
// hstcp2.ini     public
// ;转托管没有证券账户提示信息 (格式：txt文件或者提示信息，营业部名称替换串@BranchName@，联系电话号码替换串@PhoneNumber@)
// ZTG_NoSecumAccountInfo=
// ;转托管证券账户状态异常提示信息 (格式：txt文件或者提示信息，营业部名称替换串@BranchName@，联系电话号码替换串@PhoneNumber@)
// ZTG_SecumAccountAbnormalStatusInfo=
// ;转托管上海证券账户未指定提示信息 (格式：txt文件或者提示信息，营业部名称替换串@BranchName@，联系电话号码替换串@PhoneNumber@)
// ZTG_UnspecifiedSHSecumAccountInfo=
