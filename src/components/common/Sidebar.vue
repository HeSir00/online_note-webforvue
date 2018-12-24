<template>
  <div class="sideBar" @contextmenu.prevent="sendEditState"
       @click=" watchClicl();closeCreate; isCteate = false;isShowIn = false;isEditFolder = false;renameBox = false">
    <div class="userInfo">
      <div class="header" @click="editUser;isEditBox = !isEditBox"></div>
      <div class="user">
        <!--<p>{{username}}</p>-->
      </div>

    </div>
    <div class="noteMark" @contextmenu.prevent="isCteate =!isCteate">My NoteBook <span>+</span></div>

    <div class="createModule" v-show="isCteate"><p @click.stop="isShowIn = true;isCteate = false;partOrFolder = 1">+
      新建笔记本</p></div>

    <ul class="folder">
      <li class="eachPart" v-for="(item,index) in allCate" @click="clickItem(item,index)"
          :class="{showChildren:index == isShowChildren} ">
        <div class="createPart" :class="{thisPart:index == isChoosePart}" @click.stop="">
          <span></span><input type="text" v-model="editPartName" autofocus="autofocus" @blur="editName">
        </div>

        <div class="partName" @contextmenu.prevent="getPart(item,index)"><span></span>
          <p @contextmenu.prevent="openEditMean">{{item.part_name}} </p></div>

        <ul class="childrenMenu" :class="{showChildren:index == isShowChildren} ">

          <li v-for="(v,index) in item.children" @click.stop="chooseFolder(v,item)"
              v-bind:class="{'activeNext':v.folder_name==clickName}">

            <div @contextmenu.prevent="getPart(v,index,item.part_id)"><p @contextmenu.prevent="openEditMean">
              {{v.folder_name}}</p>
            </div>
            <p class="editFolderBox" @click.stop="" :class="{thisFolder:index == isChooseFolder}"><input
              v-model="editFolderName" @blur="editName" type="text"></p>

          </li>

        </ul>

      </li>
    </ul>


    <ul class="editFolder" ref="editFolder" v-show="isEditFolder">
      <li @click.stop="geRename">重命名</li>
      <!--<li v-show="!isShowEditList" @click.stop="createFolder();isShowIn = true;isEditFolder = false" >创建笔记本</li>-->
      <li @click.stop="isShowIn = true;isEditFolder = false;partOrFolder = 1">创建笔记本</li>
      <li @click.stop="isShowIn = true;isEditFolder = false;partOrFolder = 2">新建文件夹</li>
      <li v-show="isShowEditList">新建笔记</li>
      <li>删除</li>
    </ul>


    <div class="createNote" v-show="isShowIn">
      <input type="text" v-model="newName" autofocus="autofocus" @click.stop="isShowIn = true"
             @blur="createPartOrFolder">
    </div>

    <div class="userEdit" v-show="isEditBox">
      <div class="editContent">
        <div class="closeBtn" @click="isEditBox = !isEditBox"> X</div>
        <div class="userHeader"></div>
        <div class="userInfo" v-show="!isChangePwd">
          <label>
            <span>昵称：</span>
            <p v-show="!isEditInput">{{username}}</p>
            <input class="inText" type="text" v-show="isEditInput" v-model="editNewName">
          </label>

          <label>
            <span>Email：</span>
            <p v-show="!isEditInput">{{userEmail}}</p>
            <input class="inText" type="text" v-show="isEditInput" v-model="editNewEmail">
          </label>
          <label>
            <span>手机：</span>
            <p v-show="!isEditInput">{{userPhone}}</p>
            <input class="inText" type="text" v-show="isEditInput" v-model="editNewPhone">
          </label>

          <label>
            <span>性别：</span>
            <p v-show="!isEditInput">{{userSex |sexFilter}}</p>
            <div class="chooseSex" v-show="isEditInput">
              <label>
                男 <input name="sex" type="radio" value="1" v-model="editNewSex">
              </label>
              <label>
                女 <input name="sex" type="radio" value="2" v-model="editNewSex">
              </label>
              <label>
                保密<input name="sex" type="radio" value="0" v-model="editNewSex">
              </label>
            </div>
          </label>
        </div>

        <div class="changePassword" v-show="isChangePwd">
          <label> <span>密码：</span><input type="password" v-model="oldPassword"></label>
          <label><span>新密码：</span><input type="password" v-model="newPassword"></label>
          <label><span>重复密码：</span><input type="password" v-model="rePassword"></label>
        </div>


        <div class="btns">
          <button class="saveBtn" v-show="isBtn" @click="save()">保存</button>
          <button class="restBtn" v-show="isBtn" @click="isEditInput = !isEditInput;isBtn = false;isChangePwd = false">取消</button>
          <button class="changeBtn" @click="changeInfo('info')"
                  v-show="!isEditInput">修改信息
          </button>
          <button class="changeBtn" @click="changePwd('pwd')" v-show="!isEditInput">
            修改密码
          </button>
        </div>


      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Sidebar",
    data: function () {
      return {
        isCteate: false,
        isShowIn: false,
        newName: '',
        username: '',
        userEmail: '',
        allCate: [],
        clickName: '',
        isShowChildren: -1,       // 选中那个part 显示folder
        isEditFolder: false,// 新建 重命名 删除框
        reName: '',
        clickY: '',
        renameBox: false,       //重命名输入框
        thisFolderIndex: '',    //folder
        isChoosePart: -1,       //当前选中的part
        isPartIndex: '',
        editPartName: '',       //修改partname
        editPartId: '',         //获取要修改part的 ID
        isChooseFolder: -1,     //当前选中的folder
        isFolderIndex: '',
        editFolderName: '',      //获取修改folder的name
        editFolderId: '',        //获取修改folder的ID
        isShowEditList: false,  //编辑菜单中显示类容
        partOrFolder: '',          //通过传值 区别创建的是part 还是 folder

        getPartId: '',             //x新建文件夹 需要的partID

        isEditBox: false,          //修改用户 信息
        isEditUser: false,          //修改用户 信息
        isEditInput: false,              //输入框
        editNewName: '',              //输入框
        editNewEmail: '',              //输入框
        editNewPhone: '',              //输入框
        editNewSex: 0,                //输入框
        isChangePwd: false,             //修改密码状态
        oldPassword: '',
        newPassword: '',
        rePassword: '',
        isBtn: false,
        isSaveState: ''
      }
    },
    filters: {
      sexFilter: function (value) {
        if (value == 0) {
          return '保密';
        } else if (value == 1) {
          return '男'
        } else {
          return '女'
        }
      }
    },
    props: {
      clearEditFolderState: {
        require: true
      }
    },
    watch: {
      clearEditFolderState: function () {
        this.isEditFolder = this.clearEditFolderState;
      }
    },

    created() {
      this.username = localStorage.getItem('username');
      this.userEmail = localStorage.getItem('userEmail');
      this.userID = localStorage.getItem('userID');
      this.userSex = localStorage.getItem('userSex');
      this.userPhone = localStorage.getItem('userPhone');
      console.log(this.userID)

      this.$ajax.post("/api/folder/lis", {}).then(function (res) {
        this.allCate = res.data;
        console.log(this.allCate);
      }.bind(this)).catch(function (error) {
      });
    },
    methods: {
      sendEditState: function () {
        console.log(this.isEditFolder);
        this.$emit('editFolderState', this.isEditFolder);
      },


      clickItem(item, index) {
        item.isShow = !item.isShow;
        this.isEditFolder = false;
        this.isChoosePart = -1;
        this.isChooseFolder = -1;
        this.isShowChildren = index;
      },

      chooseFolder: function (v, item) {
        console.log(v);
        this.isChoosePart = -1;
        this.isChooseFolder = -1;
        this.isEditFolder = false;
        this.clickName = v.folder_name;
        //选择文件名称 把id传出去 获取所有的标题传递到父组件
        this.$ajax.post("/api/article/geArticleByfolder", {'folderId': v.folder_id}).then(function (res) {
          var data = {
            folderId: v.folder_id,
            data: res.data
          };
          this.$emit('sendFolder', data);
        }.bind(this)).catch(function (error) {
        });


      },
      closeCreate: function () {
        console.log('guanbio')
      },

      /*编辑菜单*/
      openEditMean: function (event) {
        this.isEditFolder = false;
        this.renameBox = false;
        console.log(event.screenY);
        this.clickY = event.screenY;
        this.isEditFolder = !this.isEditFolder;
        this.$refs.editFolder.style.top = event.screenY - 80 + 'px';

      },
      //获取是 part  还是 folder
      getPart: function (item, index, partId) {
        console.log(item, index);
        console.log(partId);
        this.reName = item;
        this.getPartId = partId;

        console.log(this.reName.part_name);
        console.log(this.reName.folder_name);
        if (this.reName.part_name) {
          this.isShowEditList = false;
          this.isPartIndex = index;
          this.isChooseFolder = -1;
        } else if (this.reName.folder_name) {

          this.isShowEditList = true;
          this.isFolderIndex = index;
        }


        //选择的元素
      },
      //重命名
      geRename: function () {
        console.log(this.isPartIndex)
        console.log(this.isFolderIndex)

        this.isEditFolder = false;
        this.renameBox = true;
        if (this.reName.part_name) {
          this.isChoosePart = this.isPartIndex;
          this.editPartName = this.reName.part_name;  //part_name
          this.editPartId = this.reName.part_id;      //part_id
        } else if (this.reName.folder_name) {
          this.isChooseFolder = this.isFolderIndex;
          this.editFolderName = this.reName.folder_name;  //part_name
          this.editFolderId = this.reName.folder_id;      //part_id
        }
      },

      //修改名称 重命名提交
      editName: function () {
        if (this.reName.part_name) {
          if (this.editPartName != this.reName.part_name) {
            this.$ajax.post("/api/part/edit", {
              'partName': this.editPartName,
              "partId": this.editPartId
            }).then(function (res) {
              console.log(res);
              this.renameBox = false;
              //重新加载 所有的part
              this.$ajax.post("/api/folder/lis", {}).then(function (res) {
                this.allCate = res.data;
              }.bind(this)).catch(function (error) {
              });
            }.bind(this)).catch(function (error) {
            });
          } else {
            console.log('没有改变');
            this.renameBox = false;
          }
        }

        //修改文件夹名称
        if (this.reName.folder_name) {

          console.log(this.editFolderName);
          this.isChooseFolder = this.thisFolderIndex;
          if (this.editFolderName != this.reName.folder_name) {
            this.$ajax.post("/api/folder/edit", {
              'folderName': this.editFolderName,
              "folderId": this.editFolderId
            }).then(function (res) {
              console.log(res);
              this.renameBox = false;
              //重新加载 所有的part
              this.$ajax.post("/api/folder/lis", {}).then(function (res) {
                this.allCate = res.data;
              }.bind(this)).catch(function (error) {
              });
            }.bind(this)).catch(function (error) {
            });
          } else {
            console.log('没有改变');
            this.renameBox = false;
          }
        }


      },

      //新建文件夹 和 笔记本
      createPartOrFolder: function () {
        if (this.partOrFolder == 1) {
          if (this.newName == '') {
            this.isShowIn = false;
          } else {
            this.$ajax.post("/api/part/add", {
              'partName': this.newName,
            }).then(function (res) {
              if (res.data.num == 101) {
                this.$my_message({content: res.data.msg, type: 'success',});
                //重新加载 所有的part
                this.$ajax.post("/api/folder/lis", {}).then(function (res) {
                  this.allCate = res.data;
                }.bind(this)).catch(function (error) {
                });
              }
            }.bind(this)).catch(function (error) {
            });
            this.isShowIn = false;
            this.newName = '';
          }
        } else {
          var id = '';
          if (this.reName.part_id) {
            id = this.reName.part_id;
          } else {
            id = this.getPartId
          }

          if (this.newName == '') {
            this.isShowIn = false;
          } else {
            this.$ajax.post("/api/folder/add", {
              'folderName': this.newName,
              'partId': id,
            }).then(function (res) {
              if (res.data.num == 101) {
                this.$my_message({content: res.data.msg, type: 'success',})
                //重新加载 所有的part
                this.$ajax.post("/api/folder/lis", {}).then(function (res) {
                  this.allCate = res.data;
                }.bind(this)).catch(function (error) {
                });
              }
            }.bind(this)).catch(function (error) {
            });
            this.isShowIn = false;
            this.newName = '';
          }
        }
      },
      //sidebar 点击事件
      watchClicl: function () {
        this.isChoosePart = -1;//当前选中的part
        this.isChooseFolder = -1;//恢复
      },

      editUser: function () {
      },

      // 修改用户信息
      changeInfo: function (state) {
        this.isEditInput = !this.isEditInput;
        this.isBtn = !this.isBtn;
        this.isSaveState = state;

        this.editNewName = this.username;
        this.editNewEmail = this.userEmail;
        this.editNewPhone = this.userPhone;
        this.editNewSex = this.userSex;
      },
      changePwd: function (state) {
        this.isEditInput = !this.isEditInput;
        this.isChangePwd = !this.isChangePwd;
        this.isBtn = !this.isBtn;
        this.isSaveState = state;
      },
      //保存修改
      save: function () {
        var changeInfo = {
          'userid': this.userID,
          'username': this.editNewName,
          'useremail': this.editNewEmail,
          'userphone': this.editNewPhone,
          'usersex': this.editNewSex,
        };
        var changePwd = {
          'userid': this.userID,
          'oldPassword': this.oldPassword,
          'newPassword': this.newPassword,
        };
        if (this.isSaveState == 'info') {
          this.$ajax.post("/api/login/editInfo", changeInfo).then(function (res) {
            if (res.data.num == 101) {
              this.$my_message({content: res.data.msg, type: 'success',});
              this.isEditInput = !this.isEditInput;
              this.isBtn = false;
              this.username = res.data.data.user_name;
              this.userEmail = res.data.data.user_email;
              this.userSex = res.data.data.user_sex;
              this.userPhone = res.data.data.user_phone;
            }
          }.bind(this)).catch(function (error) {
          });
        } else {
          if (this.oldPassword == '') {
            this.$my_message({content: '必须填写旧 的密码', type: 'danger'});
          }
          if (this.newPassword != this.rePassword) {
            this.$my_message({content: '两次密码不一致', type: 'danger'});
          } else {
            this.$ajax.post("/api/login/changePwd", changePwd).then(function (res) {
              if (res.data.num == 101) {
                this.$my_message({content: res.data.msg, type: 'success',});
                this.isEditInput = !this.isEditInput;
                this.isChangePwd = !this.isChangePwd;
                this.isBtn = false;
              }
            }.bind(this)).catch(function (error) {
            });
          }

        }

      },
    }
  }


</script>

<style lang="less">
  .userInfo {
    .header {
      margin: 30px auto;
      width: 50px;
      height: 50px;
      background: #ce003c;
      border-radius: 50%;
    }
    .user {
      p:nth-of-type(1) {
        margin-top: -15px;
        width: 100%;
        height: 30px;
        text-align: center;
        font-size: 16px;
        color: #000;

      }
      p:nth-of-type(2) {
        width: 100%;
        height: 20px;
        font-size: 12px;
      }
    }
  }

  .noteMark {
    width: 100%;
    height: 40px;
    margin-top: 20px;
    line-height: 40px;
    background: #0f4e84;
    color: #fff;
    span {
      color: #00d600;
      font-size: 12px;
    }
  }

  .createModule {
    width: 180px;
    height: 150px;
    left: 10px;
    position: absolute;
    z-index: 99;
    font-size: 14px;
    background-color: #fff;
    box-shadow: 0 0 5px slategrey;
    p {
      width: 90%;
      height: 40px;
      margin: 30px auto;
      line-height: 40px;
      color: #fff;
      border-radius: 5px;
      background-color: rgb(15, 133, 198);
      cursor: default;
      &:hover {
        background-color: rgb(15, 78, 132);
      }
    }
  }

  .folder {
    margin: 10px auto;
    width: 90%;
    .eachPart {
      position: relative;
    }

    .partName {
      height: 30px;
      width: 100%;
      line-height: 30px;
      margin: 5px 0;
      font-size: 13px;
      cursor: default;
      font-weight: 600;
      color: #2c3e50;
      text-align: left;
      text-indent: 40px;
      /*background-color: #00d600;*/
      &:hover {
        color: rgb(15, 78, 132);
      }
      span {
        display: inline-block;
        float: left;
        position: relative;
        left: 40px;
        top: 10px;
        /*width: 15px;*/
        /*height: 15px;*/
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
        border-right: 5px solid transparent;
        border-left: 6px solid #202d3b;
      }

      p {
        float: left;
        display: inline-block;
      }

      input {
        float: left;
        width: 130px;
        height: 25px;
        position: relative;
        left: 50px;
      }
    }

    .editFolderBox {
      display: none;
      width: 100%;
      height: 32px;
      position: absolute;
      background-color: #fff;
      margin-top: -32px;
      input {
        margin-left: 50px;
        display: block;
        width: 120px;
        height: 25px;
        font-size: 12px;
        text-indent: 2px;
        border: 1px solid #618ab1;
      }
    }
    .thisFolder {
      display: block;
    }

    .childrenMenu {
      position: relative;
      /*overflow: hidden;*/
      display: none;
      li {
        /*height: 30px;*/
        line-height: 30px;
        width: 100%;
        font-size: 13px;
        cursor: default;
        text-align: left;
        text-indent: 60px;
        border-radius: 5px;
        margin: 2px 0;
        &:hover {
          background-color: rgba(18, 160, 255, 0.67);
          color: #fff;
        }
        div {
          width: 100%;
          height: 30px;
          margin: 2px 0;

        }

      }
      .createNew {
        background-color: transparent;
        background-color: red;
        &:hover {
          background-color: transparent;
        }
        input {
          height: 25px;
          width: 125px;
          border: 1px solid #618ab1;
          text-indent: 2px;
          font-size: 12px;
        }
      }
      .activeNext {
        background-color: rgb(18, 160, 255);
        color: #fff;
        border-radius: 5px;
      }
    }
    .showChildren {
      display: block;
      /*p {*/
      /*color: rgb(15, 78, 132);*/
      /*}*/
      span {
        position: relative;
        top: 10px;
        margin-right: 5px;
        border-top: 5px solid rgb(15, 78, 132);
        border-bottom: 5px solid transparent;
        border-right: 5px solid transparent;
        border-left: 5px solid transparent;
      }

    }

    .createPart {
      width: 180px;
      height: 35px;
      overflow: hidden;
      position: absolute;
      z-index: 999;
      text-indent: 30px;
      background-color: #0d79bf;
      display: none;
      span {
        display: inline-block;
        float: left;
        position: relative;
        left: 35px;
        top: 14px;
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
        border-right: 5px solid transparent;
        border-left: 6px solid #fff;
      }
      input {
        width: 130px;
        margin-top: 1px;
        height: 31px;
        font-size: 12px;
        text-indent: 2px;
        border: none;
      }
    }
    .thisPart {
      display: block;
    }
  }

  .editFolder {
    width: 150px;
    /*overflow: hidden;*/
    position: absolute;
    left: 150px;
    background-color: #fff;
    box-shadow: 0 0 1px rgba(15, 78, 132, 0.58);
    li {
      width: 100%;
      position: relative;
      z-index: 9999;
      height: 40px;
      line-height: 40px;
      font-size: 12px;
      text-align: center;
      border-bottom: 1px solid #e5e5e5;
      background-color: #fff;
      cursor: default;
      &:hover {
        background-color: #e5e5e5;
      }
    }

  }

  //重命名
  .editName {
    width: 200px;
    height: 35px;
    position: absolute;
    overflow: hidden;
    text-indent: 35px;
    background-color: #0d79bf;
    border-left: 3px solid red;
    span {
      display: inline-block;
      float: left;
      position: relative;
      left: 45px;
      top: 14px;
      border-top: 5px solid transparent;
      border-bottom: 5px solid transparent;
      border-right: 5px solid transparent;
      border-left: 6px solid #fff;
    }
    input {
      width: 135px;
      margin-top: 1px;
      height: 31px;
      font-size: 12px;
      text-indent: 2px;
      border: none;
    }
  }

  .createNote {
    input {
      height: 25px;
      text-indent: 10px;
      border: 1px solid #618ab1;
      border-radius: 2px;
      &:focus {
        outline: none;
        border: 1px solid #00d600;
      }
    }
  }

  .userEdit {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 9999999;
    background-color: rgba(44, 62, 80, 0.1);
    .editContent {
      width: 500px;
      height: 300px;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      border-radius: 5px;
      background-color: #fff;
      box-shadow: 0 0 5px rgba(35, 48, 84, 0.46);
      .closeBtn {
        position: absolute;
        right: 10px;
        top: 10px;
        font-size: 12px;
        cursor: pointer;
        color: #2c3e50;
      }
      .userHeader {
        float: left;
        width: 100px;
        height: 100px;
        background-color: #2c3e50;
        border-radius: 50%;
        margin-top: 100px;
        margin-left: 50px;
      }
      .userInfo {
        float: left;
        margin-left: 50px;
        margin-top: 80px;
        label {
          width: 300px;
          height: 30px;
          font-size: 14px;
          display: block;
          margin: 5px auto;
          /*overflow: hidden;*/
          span {
            float: left;
            display: inline-block;
            width: 80px;
            height: 30px;
            line-height: 30px;
            text-indent: 20px;
            text-align: left;
          }
          p {
            float: left;
            width: 130px;
            height: 30px;
            line-height: 30px;
            text-align: left;
          }
          .inText {
            width: 150px;
            height: 25px;
            float: left;
            position: relative;
            top: 0px;
            left: 10px;
            text-indent: 10px;
            border: 1px solid #506f91;
          }
          .chooseSex {
            height: 30px;
            label {
              width: 55px;
              height: 30px;
              line-height: 20px;
              margin-top: 2px;
              float: left;
              input[type='radio'] {
                width: 15px;
                height: 15px;
              }
            }
          }
        }
      }
      .changePassword {
        width: 250px;
        height: 150px;
        float: left;
        margin-top: 90px;
        font-size: 14px;
        label {
          display: block;
          margin-bottom: 20px;
          span {
            display: inline-block;
            width: 80px;
          }
          input {
            display: inline-block;
            height: 22px;
            width: 150px;
            text-indent: 10px;
          }

        }
      }

      .btns {
        position: absolute;
        right: 20px;
        bottom: 20px;
        button {
          height: 25px;
          line-height: 26px;
          padding: 0 15px;
          border: none;
          border-radius: 10px;
          font-size: 12px;
          background-color: #6e9bc8;
          color: #fff;
          &:focus {
            outline: none;
          }
        }
        .restBtn {
          background-color: #fff;
          border: 1px solid #7dafdd;
          color: #2c3e50;
          margin-left: 20px;
        }

        .changeBtn {
          &:hover {
            background-color: #2c3e50;
          }
        }
        .saveBtn {
          &:hover {
            background-color: #2c3e50;
          }
        }
        .restBtn {
          &:hover {
            border: 1px solid #233054;
          }
        }
      }
    }
  }
</style>
