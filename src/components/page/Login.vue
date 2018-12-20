<template>
  <div id="login">
    <div class="loginTitle">
      <span @click="closeLogin"></span>
    </div>
    <h1>Note_Online</h1>

    <form action="">
      <label>
        <span>用户名:</span>
        <input type="text" v-model="username">
      </label>
      <label>
        <span>密  码:</span>
        <input type="text" v-model="password">
      </label>
      <label>
        <button @click="login"> 登录</button>
        <button>注册</button>
      </label>
    </form>


  </div>
</template>

<script>
  // var ipc = window.require('electron').ipcRenderer;
  export default {
    name: "Login",
    data: function () {
      return {
        username: '',
        password: '',
      }
    },
    created() {
      var name = localStorage.getItem('name123');
      if (name) {
        ipc.send('go-mianWindow');
      }
    },
    methods: {
      login: function () {
        // this.$router.replace({path: '/home'});
        // localStorage.setItem('name122', this.username);
        // this.$router.replace({path: '/home'});
        // ipc.send('go-mianWindow');

        this.$ajax.post("/api/login", {
          'username': this.username,
          'password': this.password
        }).then(function (res) {
          console.log(res);
          if (res.data.num == 101) {
            console.log(res);
            localStorage.setItem('username', res.data.username);
            localStorage.setItem('userEmail', res.data.userEmail);
             this.$router.push('/');
          }
        }.bind(this)).catch(function (error) {
        });


      },
      closeLogin: function () {
        ipc.send('close_login');
      }
    }
  }

</script>

<style scoped lang="less">
  #login {
    width: 100%;
    height: 100%;
    background-color: #2c3e50;
    h1 {
      margin-top: 20px;
      color: #fff;
    }
  }

  .loginTitle {
    width: 100%;
    height: 30px;
  }

  .loginTitle span {
    color: #fff;
    line-height: 30px;
    text-align: center;
    height: 20px;
    width: 20px;
    font-size: 18px;
    padding: 1px;
    top: 2px;
    right: 5px;
    position: absolute;
  }

  .loginTitle span:before {
    content: "\2716";
  }

  .loginTitle span:hover {
    color: red !important;
  }

  form {
    margin-top: 60px;

    label {
      display: block;
      margin: 10px auto;
      width: 400px;
      height: 40px;
      span {
        display: inline-block;
        width: 80px;
        padding-right: 50px;
        text-align: right;
        float: left;
        color: #fff;
      }
      input {
        float: left;
        width: 200px;
        height: 20px;
        text-indent: 15px;
      }

      button {
        width: 80px;
        height: 30px;
        border: none;
        margin: 0 10px;
        margin-top: 50px;

      }
    }

  }


</style>
