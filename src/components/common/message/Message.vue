<template>
  <transition name="fade">
    <div class="message" :class="type" v-if="visible">
      <p>{{type}}</p>
      <div>
        <span> {{content}}</span>
        <span v-if="hasClose" @click="visible=false">X</span>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: "MyMessage",
    data() {
      return {
        content: '',
        time: 3000,
        visible: false,
        type: 'info',//'success','warning','error'
        hasClose: true, //是否显示关闭按钮
      }
    },
    mounted() {
      this.close()
    },
    methods: {
      close() {
        window.setTimeout(() => {
          this.visible = false
        }, this.time);
      }
    }
  }
</script>

<style lang="less" scoped>
  .message {
    position: fixed;
    right: 50px;
    bottom: 50px;
    width: 300px;
    height: 70px;
    background-color: #ecf0ff;
    border-radius: 5px;
    z-index: 999999;

    p {
      font-size: 14px;
      text-indent: 15px;
      margin: 2px 0;
    }
    div {
      font-size: 14px;
      span:nth-of-type(1) {
        float: left;
        display: inline-block;
        width: 270px;
        height: 45px;
        text-align: center;
        line-height: 22px;
      }
      span:nth-of-type(2) {
        float: left;
        display: inline-block;
        text-align: center;
        width: 20px;
        height: 20px;
        line-height: 20px;
        background-color: #506f91;
        border-radius: 50%;
        cursor: pointer;
        color: #fff;
        font-size: 10px;

      }
    }
  }

  .success {
    background-color: #dff0d8;
  }

  .danger {
    background-color: #f2dede;
  }
</style>
