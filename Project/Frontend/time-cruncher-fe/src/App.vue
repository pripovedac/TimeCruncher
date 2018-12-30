<template>
  <div id="app">
    <router-view/>
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
  }
  body {
    background: rgb(87,9,255);
    background: linear-gradient(#80d0c7, #13547a);
    background-repeat: no-repeat;
    background-attachment: fixed;
  }
</style>
