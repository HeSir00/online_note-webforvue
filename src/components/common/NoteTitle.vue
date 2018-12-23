<template>
  <!--@contextmenu.prevent="isChangeTitle = false"-->

  <div class="allNote-title" @click="isChangeTitle = false;isChooseTitle = -1;isShowAddBox = false">
    <ul>

      <li v-for="(item,index) in noteTitles.data.data"
          @click="showNoteContent(item.article_id,index)"
          @contextmenu="showNoteContent(item.article_id,index,item.article_title)"
          @contextmenu.prevent="open"
          :class="{active:index == isChoose}">
        <span></span>
        <p>{{item.article_title}}</p> <span></span>


        <div class="createPart" @click.stop="" :class="{thisTitle:index == isChooseTitle}">
          <input type="text" v-model="editTitle" autofocus="autofocus" @blur="changeTitle">
        </div>
      </li>

      <li class="addTitle" v-show="isShowAddBox">
        <input v-model="newTitle" type="text" @click.stop="" autofocus="autofocus" @blur="add">
      </li>
    </ul>


    <div class="changeTitle" ref="changeTitle" v-show="isChangeTitle">
      <div @click.stop="geRename()"><span></span>
        <p>重命名</p></div>
      <div @click.stop="createTitle()"><span></span>
        <p>新建笔记</p></div>
      <div @click.stop="del"><span></span>
        <p>删除</p></div>
    </div>

    <p class="allNote-footer"> 总共 {{noteTitles.data.count}} 篇</p>
  </div>
</template>

<script>

  export default {
    name: "NoteTitle",
    data: function () {
      return {
        allNoteTitle: '',
        isChangeTitle: false,        //重命名 删除新建 菜单状态
        isChoose: -1,        //选中哪一条title
        isShowEditMenu: false, //控制显示 编辑按钮
        isShowAddBox: false,  //控制显示  编辑框
        newTitle: '',         //新添加的 标题名称
        isChooseTitle: -1,     //选中哪条title
        oldTitle: '',           // 修改之前的标题
        editTitle: '',         // 修改的标题
        titleId: '',            //标题id
      }
    },
    props: {
      noteTitles: {
        required: true
      },
    },


    methods: {
      //传值
      showNoteContent: function (id, index, title) {
        this.isChoose = index;
        this.$emit('articleId', id);
        this.editTitle = title;
        this.oldTitle = title;
        this.titleId = id;
      },
      open: function (event) {
        if (this.noteTitles.data.count > -1) {
          this.isChangeTitle = true;
          this.$refs.changeTitle.style.top = event.screenY - 160 + 'px';
          this.$refs.changeTitle.style.left = event.offsetX + 20 + 'px';
        }
      },
      addBtn: function () {
        this.isShowEditMenu = false;
        this.isShowAddBox = true;
      },
      add: function () {
        var folderId = this.noteTitles.folderId;
        if (this.newTitle == '') {
          this.isShowAddBox = false;
        } else {
          this.$ajax.post("/api/article/add", {
            "articleTitle": this.newTitle,
            'folderId': folderId
          }).then(function (res) {
            this.isShowAddBox = false;
            this.newTitle = '';
            if (res.data.num == 101) {
              this.$my_message({content: res.data.msg, type: 'success',});
              this.$ajax.post("/api/article/getTitleById", {
                'folderId': folderId
              }).then(function (res) {
                this.noteTitles.data.data = res.data;
              }.bind(this)).catch(function (error) {
              });
            }

          }.bind(this)).catch(function (error) {
          });
        }


      },
      //重命名
      geRename: function () {
        this.isChooseTitle = this.isChoose;
        this.isChangeTitle = false;
      },
      //修改
      changeTitle: function () {
        this.isChooseTitle = -1;
        var folderId = this.noteTitles.folderId;
        if (this.oldTitle != this.editTitle) {
          this.$ajax.post("/api/article/editTitle", {
            'articleId': this.titleId,
            'articleTitle': this.editTitle
          }).then(function (res) {
            this.isChangeTitle = false;
            if (res.data.num == 101) {
              this.$my_message({content: res.data.msg, type: 'success',});
              this.$ajax.post("/api/article/getTitleById", {
                'folderId': folderId
              }).then(function (res) {
                this.noteTitles.data.data = res.data;
              }.bind(this)).catch(function (error) {
              });
            }
          }.bind(this)).catch(function (error) {
          });
        } else {
          this.isChooseTitle = -1;
        }

      },
      //新建笔记
      createTitle: function () {

        this.isShowAddBox = true;
        this.isChangeTitle = false;
      },

      //删除
      del: function () {
        this.isChangeTitle = false;
        var folderId = this.noteTitles.folderId;
        this.$ajax.post("/api/article/del", {
          'articleId': this.titleId
        }).then(function (res) {
          console.log(res);
          if (res.data.num == 100) {
            this.$my_message({content: res.data.msg, type: 'success',});
            this.$ajax.post("/api/article/getTitleById", {
              'folderId': folderId
            }).then(function (res) {
              this.noteTitles.data.data = res.data;
            }.bind(this)).catch(function (error) {
            });
          }
        }.bind(this)).catch(function (error) {
        });
      }


    }
  }
</script>

<style lang="less">
  .allNote-title {
    height: 100%;
    position: relative;
    .notice {
      width: 150px;
      height: 150px;
      line-height: 150px;
      border-radius: 50%;
      font-size: 14px;
      text-align: center;
      background-color: rgba(44, 62, 80, 0.03);
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      color: #3c556e;
    }
    ul {
      width: 100%;
      li {
        width: 100%;
        margin: 2px 0;
        height: 45px;
        line-height: 45px;
        font-size: 14px;
        cursor: default;
        &:hover {
          background-color: #f0f1f5;
        }
        span {
          float: left;
          margin-left: 20px;
          &:nth-of-type(1) {
            display: inline-block;
            margin-top: 17px;
            width: 10px;
            height: 10px;
            margin-right: 10px;
            background-color: #2c3e50;
          }
          &:nth-of-type(2) {
            float: right;
            font-size: 12px;
            color: #3b536b;
          }
        }
        p {
          float: left;
          font-size: 12px;
          text-align: left;
          color: #19233d;
          width: calc(100% - 55px);
        }
        .createPart {
          display: none;
          width: 90%;
          float: left;
          margin-top: 5px;
          position: absolute;
          left: 40px;
          input {
            float: left;
            height: 30px;
            width: 85%;
            text-indent: 10px;
            border: 1px solid rgba(35, 48, 84, 0.68);
          }
        }
        .thisTitle {
          display: block;
        }
      }
      .active {
        background-color: #e5e5e5;
      }

    }

  }

  .allNote-footer {
    position: absolute;
    bottom: 60px;
    width: 100%;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    background: #f0f0f0;
  }

  .splitLine {
    width: 2px;
    height: 100%;
    /*background-color: rgba(231, 231, 231, 0.49);*/
    cursor: w-resize;
    float: right;
    position: absolute;
    z-index: 999;
    top: 0;
    left: 300px;
  }

  .editMenu {
    width: 130px;
    height: 30px;
    line-height: 30px;
    background-color: #fff;
    box-shadow: 0 0 5px #b6cddf;
    font-size: 14px;
    position: absolute;
    cursor: default;
    &:hover {
      background-color: #c8ecff;
    }
    span {
      display: inline-block;
      margin-top: 5px;
      margin-right: 5px;
      text-align: center;
      line-height: 20px;
      font-size: 16px;
      width: 18px;
      height: 18px;
      border: 1px solid #707070;
      border-radius: 50%;
    }
  }

  .addTitle {
    input {
      width: 95%;
      height: 30px;
      border: 1px solid #618ab1;
      text-indent: 10px;
      font-size: 12px;
    }
  }

  .changeTitle {
    background-color: #fff;
    width: 160px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9999;
    box-shadow: 0 0 5px #859eb6;
    border-radius: 1px;
    div {
      height: 40px;
      line-height: 40px;
      width: 100%;
      font-size: 12px;
      &:hover {
        background-color: #ddeef9;
        color: #506f91;
      }
    }

  }

</style>
