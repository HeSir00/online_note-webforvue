<template>
  <div id="home" @click="mavonEditorState" @contextmenu.prevent="mavonEditorState()">
    <!--<div class="mainTitle" style="-webkit-app-region: drag">-->
      <!--<TitleBtn></TitleBtn>-->
    <!--</div>-->
    <div class="sideBar">
      <side-bar v-on:sendFolder="getFolder($event)"
                v-on:editFolderState="getEditFolderState($event)"
                v-bind:clearEditFolderState='clearEditFolderState'>
      </side-bar>
    </div>

    <div class="content" id="content" @click.stop="clearState()" @contextmenu.prevent="clearState()">
      <div class="noteList" id="noteList">
        <note-title
          v-bind:noteTitles="noteTitles"
          v-on:articleId="getContent($event)">
        </note-title>
        <div class="splitLine" id="splitLine2"></div>
      </div>
      <div class="noteContent" id="noteContent">
        <note-content
          v-bind:sendArticleId="sendArticleId"
          v-on:selectId="getChooseId($event)"
        ></note-content>
      </div>
    </div>


  </div>
</template>

<script>
  import TitleBtn from '../common/TitleBtn';
  import SideBar from '../common/Sidebar';
  import NoteTitle from '../common/NoteTitle';
  import NoteContent from '../common/NoteContent';
  // var ipc = window.require('electron').ipcRenderer;
  export default {
    name: "Login",
    components: {TitleBtn, SideBar, NoteTitle, NoteContent},
    data: function () {
      return {
        isCteate: false,
        noteTitles: '',
        sendArticleId: '',
        searchText: '',
        clearEditFolderState: true,     //文件夹 编辑状态
        clearEditTitleState: true,      //标题 编辑专题该
        getArticleId: '',
        const: 0,
      }
    },
    created() {
      // ipc.send('go-mianWindow');

    },
    methods: {
      close: function () {
        ipc.send('close-login');
      },
      goWindow: function () {
        ipc.send(('go-mianWindow'));
      },


      showNoteContent: function (index) {
        console.log(index);
      },

      //获取文件夹编辑状态
      getEditFolderState: function (state) {
        this.clearEditFolderState = state;
      },
      clearState: function () {
        this.clearEditFolderState = '';
      },

      //
      mavonEditorState: function () {

        this.const++;
        var thisId = 378504221 + this.const;
        this.sendArticleId = ''
        this.sendArticleId = thisId
      },
      getChooseId: function (state) {
        this.getArticleId = state;

        console.log(state)
      },

      //获取sidebar 传过来的article
      getFolder: function (folder) {
        this.noteTitles = folder;
      },
      //获取文章
      getContent: function (id) {
        this.sendArticleId = id;

        console.log(this.sendArticleId)
      },


    }
  }


  window.onload = function () {
    splitDrag("content", 'noteList', 'splitLine2', 'noteContent');
  }


</script>

<style lang="less">
  #home {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: white;
  }

  .mainTitle {
    width: 100%;
    height: 30px;
    position: fixed;
    top: 0;
    background-color: #2c3e50;
  }

  .sideBar {
    float: left;
    width: 200px;
    margin-top: 30px;
    height: calc(100% - 30px);
    background-color: #fff;
  }

  .content {
    float: left;
    width: calc(100% - 202px);
    /*margin-top: 30px;*/
    height:100%;
    background: #f7f7f7;
    .noteList {
      float: left;
      width: 300px;
      height: 100%;
      position: relative;
      .search {
        margin: 10px 0;
        input {
          width: 90%;
          height: 35px;
          text-indent: 15px;
          border-radius: 35px;
          font-size: 14px;
          border: 1px solid #f0f0f0;
        }
        span {
          font-size: 12px;
          color: #ce003c;
          position: relative;
          left: -30px;
          cursor: default;
          &:hover {
            color: red;
          }
        }
      }
    }
    .noteContent {
      float: left;
      width: calc(100% - 302px);
      height: 100%;
      overflow: hidden;
      background: #fff;
    }
  }

  .tipCommon {

    /*overflow: hidden;*/
  }


</style>
