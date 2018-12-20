<template>
  <div id="titleBtn" style="-webkit-app-region: no-drag">
    <div @click="min" class="min"><span></span></div>
    <div @click="max" class="max"><span></span></div>
    <div @click="close" class="close"><span> X </span></div>
  </div>
</template>

<script>
  // var ipc = window.require('electron').ipcRenderer;
  export default {
    name: "TitleBtn",

    methods: {
      min: function () {
        ipc.send('min');
      },
      max: function () {
        ipc.send('max');
      },
      close: function () {
        ipc.send('close');
      }
    }
  }
</script>

<style scoped>
  #titleBtn {
    position: absolute;
    right: 10px;
    top: 5px;
  }

  #titleBtn div {
    float: left;
    width: 18px;
    height: 18px;
    margin-right: 12px;
    background-color: red;
    border-radius: 50%;
    overflow: hidden;
  }

  .min span {
    display: inline-block;
    width: 7px;
    height: 2px;
    position: relative;
    top: -4px;
    left: -1px;
    background-color: white;
  }

  .max span {
    display: inline-block;
    width: 7px;
    height: 5px;
    position: relative;
    top: -2px;
    left: -1px;
    border: 1px solid #fff;
  }

  .close span {
    position: relative;
    top: -1px;
  }

  .close span:before {
    content: "\2716";
    font-size: 12px;
    color: white;

  }

</style>
