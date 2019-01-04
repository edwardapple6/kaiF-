<template>
  <div id="app">
    <DatePicker/>
    
  </div>
</template>

<script>
import Botton from "../../components/mob-button";
import DatePicker from '../../components/mob-datePicker'
export default {
  name: "App",
  components: {
    Botton,
    DatePicker
  },
  data() {
    return {
      msg: "确定",
      wtcx_data:[
          {

          },
      ]
    };
  }
};
</script>

<style>
#top {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
* {
  padding: 0;
  margin: 0;
  -webkit-touch-callout:none;
  -webkit-user-select:none;
  -khtml-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
}
body {
  background-color: #fff;
  /* background-color: #f0f0f0; */
  /* font-size:0px !important; */
}
ul {
  list-style: none;
}
</style>
<style scoped>
  
</style>
