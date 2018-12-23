<template>

  <div class="note" v-show="articleContent">
    <div class="title"><input type="text" v-model="articleContent.article_title"></div>

    <div class="contents">
      <mavon-editor class="mavonEditor" v-html="articleContent.article_content" :subfield="false"
                    :defaultOpen="defaultData"
                    :toolbarsFlag="false"
                    :boxShadow="true"/>
    </div>
    <div class="editorBox" v-show="isEdit" @keydown.ctrl.83="show($event)">
      <mavon-editor class="mavonEditor" v-model="articleContent.article_content_code" @change="changeData"/>
    </div>


    <div class="edit">
      <div class="editBtn" @click="edit();isEdit = !isEdit">{{editTxt}}</div>
    </div>
  </div>


</template>

<script>
  export default {
    name: "NoteContent",

    data() {
      return {
        isEdit: false,
        editTxt: '编辑',
        articleContent: '',
        editContnet: '',
        editContnet_code: '',
        defaultData: "preview",
        toolbar: {
          save: false,
        },

        oldId: '',
      };
    },
    props: {
      sendArticleId: {
        required: true
      }
    },
    watch: {
      sendArticleId: function () {
        if (this.sendArticleId > 378504221) {
          console.log(this.oldId);
        } else {
          this.$ajax.post("/api/article/getContentByarticleId", {
            'articleId': this.sendArticleId,
          }).then(function (res) {
            this.articleContent = res.data[0];
          }.bind(this)).catch(function (error) {
          });
        }


        this.isEdit = '';
        this.editTxt = '编辑';
        //改变点击对象 监听保存 笔记修改
        console.log(this.sendArticleId)


        if (this.editContnet != '') {
          this.$ajax.post("/api/article/edit", {
            'articleTitle': this.articleContent.article_title,
            'articleId': this.oldId,
            'articleContent': this.editContnet,
            'articleContentCode': this.editContnet_code,
          }).then(function (res) {
            if (res.data.num == 100) {
              this.$my_message({content: res.data.msg, type: 'success',});
            }

          }.bind(this)).catch(function (error) {
          });
        }

      },

    },

    methods: {
      show: function (ev) {
        if (this.editContnet != '') {
          this.$ajax.post("/api/article/edit", {
            'articleTitle': this.articleContent.article_title,
            'articleId': this.sendArticleId,
            'articleContent': this.editContnet,
            'articleContentCode': this.editContnet_code,
          }).then(function (res) {
            if (res.data.num == 100) {
              this.$my_message({content: res.data.msg, type: 'success',});
            }
          }.bind(this)).catch(function (error) {
          });
        }
      },


      edit: function () {
        this.oldId = this.sendArticleId;
        this.$emit('selectId', this.oldId);
        if (this.isEdit == false) {
          this.editTxt = '保存';
        } else {
          this.editTxt = '编辑';

          if (this.editContnet != '') {
            this.$ajax.post("/api/article/edit", {
              'articleTitle': this.articleContent.article_title,
              'articleId': this.sendArticleId,
              'articleContent': this.editContnet,
              'articleContentCode': this.editContnet_code,
            }).then(function (res) {
              if (res.data.num == 100) {
                this.$my_message({content: res.data.msg, type: 'success',});
              }

            }.bind(this)).catch(function (error) {
            });
          }
        }

      },
      changeData(value, render) {
        // 判断是否改变
        if (this.articleContent.article_content != render) {
          this.editContnet = render;
          this.editContnet_code = value;
          this.articleContent.article_content = this.editContnet
        } else {

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
