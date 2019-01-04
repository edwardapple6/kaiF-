<template>
  <div id="app">
    <kfsjj/>
  </div>
</template>

<script>
import kfsjj from './components/kfsjj'

export default {
  name: 'App',
  components: {
    kfsjj
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
* {
  margin: 0;
  padding: 0;
}
body {
  background-color: #f0f0f0;
}
</style>
