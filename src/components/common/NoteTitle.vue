<template>
  <div class="allNote-title" @contextmenu.prevent="open">
    <ul>
      <li v-for="(item,index) in noteTitles.data.data" @click="showNoteContent(item,index)"
          :class="{active:index == isChoose}"><span></span>
        <p>{{item.article_title}}</p> <span></span>
      </li>

      <li class="addTitle" v-show="isShowAddBox"><input v-model="newTitle" type="text" autofocus="autofocus"
                                                        @blur="add"></li>


    </ul>

    <div class="editMenu" v-show="isShowEditMenu" ref="editMenu" @click="addBtn()">
      <span>+</span>新建笔记
    </div>


    <p class="allNote-footer"> 总共 {{noteTitles.data.count}} 篇</p>
  </div>
</template>

<script>
  import index from "../../router";

  export default {
    name: "NoteTitle",
    data: function () {
      return {
        allNoteTitle: '',
        isChoose: -1,        //选中哪一条title
        isShowEditMenu: false, //控制显示 编辑按钮
        isShowAddBox: false,  //控制显示  编辑框
        newTitle: '',         //新添加的 标题名称
      }
    },
    props: {
      noteTitles: {
        required: true
      }
    },
    methods: {
      //传值
      showNoteContent: function (content, index) {
        console.log(index);
        this.isChoose = index;
        // console.log(content);
        this.$emit('noteContent', content);
      },
      open: function (event) {
        if (this.noteTitles.data.count > -1) {

          this.$refs.editMenu.style.top = event.offsetY + 50 + 'px';
          this.$refs.editMenu.style.left = event.offsetX + 10 + 'px';
          this.isShowEditMenu = true;

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

            console.log(res);
          }.bind(this)).catch(function (error) {
          });
        }
      }


    }
  }
</script>

<style lang="less">
  .allNote-title {
    height: 100%;
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
      li {
        padding: 0 20px;
        height: 50px;
        line-height: 50px;
        font-size: 14px;
        cursor: default;
        &:hover {
          background-color: #f0f1f5;
        }
        span {
          float: left;
          &:nth-of-type(1) {
            display: inline-block;
            margin-top: 20px;
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
          text-align: left;
          width: calc(100% - 55px);
        }
      }
      .active {
        background-color: #d2e3ee;
      }

    }

  }

  .allNote-footer {
    position: absolute;
    bottom: 0;
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

</style>
