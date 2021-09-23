<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="50%"
    @close="close"
    top="10vh"
    title="处置"
    class="dialogContainer"
    :append-to-body="true"
    @open="open"
  >
    <el-form ref="dataForm" :rules="rules" :model="temp" label-width="120px" class="mt_20">
      <el-form-item label="说明" prop="language_desc">
        <el-select v-model="temp.language_desc" filterable allow-create>
          <el-option v-for="item in languageList" :label="item.language" :value="item.language"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="处置图片" prop="deal_images">
        <el-upload action
                   :http-request="uploadSectionFile"
                   list-type="picture-card"
                   :on-remove="handleRemove"
                   :on-preview="handlePictureCardPreview"
                   :file-list="imageList"
                   :limit="200">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="showViewDialog = false">取消</el-button>
      <el-button type="primary" @click="createData()" :loading="paraLoading">确定</el-button>
    </div>
    <my-dialog :visible.sync="dialogVisible"
               title="查看图片"
               :append-to-body="true">
      <img width="100%"
           :src="dialogImageUrl"
           alt />
    </my-dialog>
  </myDialog>
</template>

<script>
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import MultipleImage from "@/components/Upload/MultipleImage.vue";
  import {languageList} from "@/api/system";
  import {collectStatus} from "@/api/collect";
  import {uploadImg} from "@/api/upload"; // waves directive
  export default {
    name: 'disposalAbandoned',
    directives: { waves },
    components: {
      draggable,
      MultipleImage
    },
    props: {
      showDialog: {
        required: true,
        type: Boolean,
        default: false
      },
      paraData: {
        required: true,
        type: Object,
        default: {
          option: {},
          operatorType: "view",
          id: ""
        }
      }
    },
    data() {
      return {
        dialogVisible:false,
        dialogImageUrl:'',
        imageList:[],
        languageList:[],
        paraLoading:false,
        temp: {
          id:'',
          status:8,
          language_desc:'',
          deal_images:''
        },
        rules: {
          language_desc: [{ required: true, message: '请输入说明', trigger: 'change' }],
        },
      }
    },
    computed: {
      showViewDialog: {
        get() {
          return this.showDialog;
        },
        set(value) {
          this.$emit("update:show-dialog", value);
        }
      },
    },
    methods: {
      uploadSectionFile (e) {
        const file = e.file;
        uploadImg(file)
          .then((res) => {
            this.imageList.push({ uid: file.uid, url: res.url ,images: res.images });
            // this.temp.deal_images=this.imageList.
            let imgArr = this.imageList.map(item=>{return item.images})
            this.temp.deal_images = imgArr.join(',')
          })
          .catch((e) => {
            this.$message({ message: "添加图片失败", type: "warning" });
          });
      },
      handleRemove (file, fileList) {
        this.temp.deal_images = '';
        this.imageList = [];
        fileList.map((item) => {
          let json = {
            url: item.url,
            images: item.images,
          };
          this.imageList.push({ uid: item.uid, url: item.url,images: item.images });
        });
        let imgArr = this.imageList.map(item=>{return item.images})
        this.temp.deal_images = imgArr.join(',')
        console.log(this.temp.deal_images)
      },
      getLanguage() {
        languageList({page:1,pageSize:99999}).then(res => {
          this.languageList = res.data.data
        });
      },
      handlePictureCardPreview (file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      open(){
        this.temp.id = this.paraData.id;
        this.getLanguage();
        this.temp.id = this.paraData.id;
        this.$nextTick(function() {

        })
      },
      close(){},
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.paraLoading = true;
              //1、待审核  2、待派遣 3、待协办申请  4、转办  5、待协办 6、协办 7、待处置  8、待结案  9、结案  0、废弃
            //0、废弃    1、待审核   2、待派遣  （3、4、5、6） 3、待处置  4、待结案  5  结案
              this.temp.status = 4;
              collectStatus(this.temp).then((res) => {
                setTimeout(()=>{
                  this.paraLoading = false
                },1000)
                if(res.code == 1) {
                  this.$emit('updateView');
                  this.showViewDialog = false;
                  this.$message({
                    message: res.message,
                    type: 'success'
                  });
                }
              }).catch(() => {
                this.paraLoading = false;
              });
          }
        })
      },
    }
  }
</script>
