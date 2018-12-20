<template>
  <div id="note">
    <div class="noteList" id="noteList">
      <router-view class="notelistView"></router-view>
      <div class="splitLine" id="splitLine2"></div>
    </div>
    <div class="noteContent" id="noteContent">
    </div>


  </div>
</template>

<script>
  export default {
    name: "Secondpage"
  }


</script>

<style lang="less">
  #note {
    float: left;
    width: calc(100% - 202px);
    height: 100%;
    background: #cbe0e9;
    .noteList{
      float: left;
      width: 300px;
      height: 100%;
      background-color: rgba(44, 62, 80, 0.49);
    }
    .splitLine {
      width: 2px;
      height: 100%;
      background-color: rgb(206, 0, 60);
      cursor: w-resize;
      float: right;
    }
    .noteContent{
      float: left;
      width: calc(100% - 302px);
      height: 100%;
      background: #577792;
    }

  }
</style>


