<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="50%"
    @close="close"
    top="15vh"
    :title="titleTxt"
    class="dialogContainer"
    :append-to-body="true"
    @open="open"
  >
    <el-form ref="dataForm" :rules="rules" :model="temp" label-width="120px" class="mt_20">
      <el-form-item label="说明" prop="language_id">
        <el-select v-model="temp.language_id">
          <el-option v-for="item in languageList" :label="item.language" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="showViewDialog = false">取 消</el-button>
      <el-button type="primary" @click="onSubmit(paraData.operatorType)" :loading="paraLoading">{{titleTxt}}</el-button>
    </div>
  </myDialog>
</template>

<script>
  import {languageList,} from '@/api/system'
  import {collectEdit,} from '@/api/collect'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  export default {
    name: 'adoptView',
    directives: { waves },
    components: {
      draggable,
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
          operatorType: 1,
          id: "",
          status:'',
        }
      }
    },
    data() {
      return {
        paraLoading:false,
        titleTxt:'',
        languageList:[],
        temp: {
          id:'',
          status:'',//1、待审核  2、待派遣 3、待协办 4、待处置  5、待结案  6、结案  0、废弃
          language_id:''
        },
        rules: {
          language_id: [{ required: true, message: '请输入说明', trigger: 'change' }],
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
      open(){
        console.log(this.paraData)
        this.titleTxt = this.paraData.operatorType==1?'通过':'废弃';
        this.temp.id = this.paraData.id;
        this.getLanguage();
      },
      close(){
        this.paraLoading=false;
        this.titleTxt='';
        this.languageList=[];
        this.temp= {
          id:'',
          status:'',//1、待审核  2、待派遣 3、待协办 4、待处置  5、待结案  6、结案  0、废弃
          language_id:''
        };
      },
      getLanguage() {
        languageList({page:1,pageSize:99999}).then(res => {
          this.languageList = res.data.data
        });
      },
      onSubmit(type){
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.paraLoading = true;
            // 通过
            if(type==1){
              // 1、待审核  2、待派遣 3、待协办申请  4、待协办 5、待处置  6、待结案  7、结案  0、废弃
              if(this.paraData.status == 1){
                this.temp.status = 2;
              }else if(this.paraData.status == 2){
                this.temp.status = 3;
              }else if(this.paraData.status == 3){
                this.temp.status = 4;
              }else if(this.paraData.status == 4){
                this.temp.status = 5;
              }else if(this.paraData.status == 5){
                this.temp.status = 6;
              }else if(this.paraData.status == 6){
                this.temp.status = 7;
              }
              console.log('111')
              collectEdit(this.temp).then((res) => {
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
            }else{//没通过
              console.log('444')
              this.temp.status = 0;
              collectEdit(this.temp).then((res) => {
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

          }
        })
      },
    }
  }
</script>
