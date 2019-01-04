<template>
    <div id="jjxq">
        <ul>
            <li v-for="(data,index) in xqcontent" :key="index">
                <span class="left">{{data.name}}</span>
                <span class="right">{{data.value}}</span>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data(){
        return{
            tittle:[],
            cells:[],
            xqcontent:[]
            // xqcontent:[
            //     {name:'基金公司',value:''},
            //     {name:'公司代码',value:''},
            //     {name:'风险等级',value:''},
            //     {name:'基金类型',value:''},
            //     {name:'前后收费类型',value:''},
            //     {name:'状态',value:''},
            //     {name:'开放日期',value:''},
            //     {name:'个人首次最低',value:''},
            //     {name:'个人在于度认购金额',value:''},
            //     {name:'个人追加认购金额',value:''},
            //     {name:'机构首次最低',value:''},
            // ]
        }
    },
    created() {
        var searchUrl = window.location.href;
        var arrData = [];
        var searchText1 = decodeURI(searchUrl);
        var searchData = searchText1.split("{fg}");
        searchData = JSON.parse(searchData[1])
        console.log(searchData);
        this.tittle = searchData.heads
        var heads = searchData.heads;
        var cell = searchData.cells;
        
        for(var i in heads){
            for(var j in cell){
                if(i === j){
                    this.xqcontent.push({name:heads[i],value:searchData[cell[j]]})
                }
            }
        }
    },
}
</script>
<style>
*{
    padding: 0;
    margin: 0;
    -webkit-touch-callout:none;
  -webkit-user-select:none;
  -khtml-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
}
body{
    font-size:0;
    background-color: #f0f0f0;
}
ul{
    list-style: none;
}
li{
    position: relative;
    height:46px;
    /* margin-bottom:1px; */
    border-bottom:1.5px solid #f0f0f0;
    background-color: #fff;
}
.left{
    position: absolute;
    top: 0;
    left: 15px;
    height:46px;
    line-height: 46px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #666666;
    letter-spacing: 0;
}
.right{
    position: absolute;
    top: 0;
    right: 15px;
    height:46px;
    line-height: 46px;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #333333;
    letter-spacing: 0;
}
li:nth-child(8),li:nth-child(14),li:nth-child(20),li:nth-child(24),li:nth-child(27) {
    margin-top:11px;
}
/* li:nth-child(8){
    margin-bottom:2px
} */
</style>
