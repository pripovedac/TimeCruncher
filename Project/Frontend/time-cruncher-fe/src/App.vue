<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'app',
  components: {
  }
}
</script>

<style>
  html {
    height: 100%;
    /*border: 1px solid red;*/
  }
  body {
    margin: 0;
    /*width: 100%;*/
    /*height: 100%;*/
    /*border: 3px solid violet;*/
    background: rgb(87,9,255);
    background: linear-gradient(#80d0c7, #13547a);
    /*background: black;*/
    background-repeat: no-repeat;
    background-attachment: fixed;
    font-family: 'Montserrat', sans-serif;
  }

</style>
