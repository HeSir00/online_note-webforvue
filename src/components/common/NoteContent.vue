<template>

  <div class="note" v-show="noteContent">

    <div class="title"><input type="text" v-model="noteContent.article_title" @blur="edit"></div>

    <div class="contents" v-show="!isEdit">
      <mavon-editor class="mavonEditor" v-html="noteContent.article_content" :subfield="false" :defaultOpen="defaultData"
                    :toolbarsFlag="false"
                    :boxShadow="true"/>
    </div>
    <div class="editorBox" v-show="isEdit" @keydown.ctrl.83="show($event)">
      <mavon-editor class="mavonEditor" v-model="noteContent.article_content_code" @change="changeData"/>
    </div>


    <div class="edit">
      <div class="editBtn" @click="edit();isEdit = !isEdit">编辑</div>
    </div>
  </div>


</template>

<script>
  export default {
    name: "NoteContent",
    props: {
      noteContent: {
        required: true
      },
      isEdit: false,

    },
    data() {
      return {
        // isEdit:false,
        editContnet: '',
        editContnet_code: '',
        defaultData: "preview",
        toolbar: {
          save: false,
        }
      };
    },
    created() {


    },
    methods: {
      show: function (ev) {

        console.log(this.noteContent.a_title);
        console.log(this.editContnet);

        if (this.editContnet != '') {
          this.$ajax.post("/api/article/edit", {
            'articleTitle': this.noteContent.a_title,
            'articleId': this.noteContent.a_id,
            'articleContent': this.editContnet,
            'articleContentCode': this.editContnet_code,
          }).then(function (res) {
           console.log(res);
          }.bind(this)).catch(function (error) {
          });
        }

      },


      edit: function () {
        if (this.isEdit == false) {
          this.editContnet = this.noteContent.content;
        }

      },
      changeData(value, render) {
        if (this.noteContent.a_content != value) {
          console.log('发生改变');
          this.editContnet = render;
          this.editContnet_code = value;

        }

      }


    }
  }
</script>

<style scoped lang="less">
  .note {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    background: #fff;
    .title {
      position: relative;
      top: 0px;
      width: 100%;
      height: 60px;
      line-height: 60px;
      text-align: left;
      font-size: 16px;
      text-indent: 20px;
      box-shadow: 4px 0px 5px #94a9be;
      input {
        height: 19px;
        width: 90%;
        font-size: 20px;
        font-weight: 500;
        color: #2c3e50;
        border: none;
        &:focus {
          outline: none;
        }
      }
    }
    .contents {
      height: calc(100% - 120px);
      width: 100%;
      position: relative;
      top: 50px;
      .mavonEditor {
        position: relative;
        top: 0px;
        margin-left: 8%;
        width: 80%;
        height: 100%;

      }

    }
  }

  .edit {
    width: 60px;
    height: calc(100% - 91px);
    background-color: #fff;
    position: absolute;
    right: 10px;
    top: 91px;
    z-index: 9999;
    border-left: 1px solid #c3defa;
    .editBtn {
      width: 40px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      font-size: 12px;
      border-radius: 2px;
      margin: 10px auto;
      color: #fff;
      background-color: #2c3e50;
      cursor: default;
      &:hover {
        background-color: #00a800;
      }
    }
  }

  .editorBox {
    height: calc(100% - 91px);
    width: calc(100% - 601px);
    position: absolute;
    top: 120px;
    /*margin-top: 100px;*/

    .mavonEditor {
      padding: 20px;
      width: 100%;
      overflow-y: scroll;
      height: 90%;
    }
    .v-note-op {
      position: absolute !important;
      top: 50px !important;
    }
    .v-note-wrapper {
    }
  }

</style>
