<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="50%"
    @close="close"
    top="10vh"
    title="申请协办"
    class="dialogContainer"
    :append-to-body="true"
    @open="open"
  >
    <el-form ref="dataForm" :rules="rules" :model="temp" label-width="120px" class="mt_20 dialog_form">
      <el-form-item label="大类" prop="big_category_name">
        <el-input v-model="temp.big_category_name" placeholder="" :disabled="true" clearable/>
      </el-form-item>
      <el-form-item label="小类" prop="small_category_name">
        <el-input v-model="temp.small_category_name" placeholder="" :disabled="true" clearable/>
      </el-form-item>
      <el-form-item label="说明" prop="language_desc">
        <el-select v-model="temp.language_desc" filterable allow-create>
          <el-option v-for="item in languageList" :label="item.language" :value="item.language"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="showViewDialog = false">取消</el-button>
      <el-button type="primary" @click="onSubmit()" :loading="paraLoading">确定</el-button>
    </div>
  </myDialog>
</template>

<script>
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import {languageList,departmentList} from "@/api/system"; // waves directive
  import {collectApplyAssist, collectTurnDeal} from '@/api/collect'
  export default {
    name: 'jointlyView',
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
          operatorType: "view",
          id: ""
        }
      }
    },
    data() {
      return {
        languageList:[],
        departmentList:[],
        paraLoading:false,
        temp: {
          id:'',
          big_category:'',
          small_category:'',
          big_category_name:'',
          small_category_name:'',
          language_desc:'',
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
      open(){
        console.log( this.paraData)
        this.temp.id = this.paraData.id;
        this.temp.big_category_name = this.paraData.option.big_category_name;
        this.temp.small_category_name = this.paraData.option.small_category_name;
        this.temp.big_category = this.paraData.option.big_category;
        this.temp.small_category = this.paraData.option.small_category;
        this.getLanguage();
        this.getDepartment();
      },
      close(){
        this.languageList=[];
        this.departmentList=[];
        this.paraLoading=false;
        this.temp= {
          id:'',
          big_category:'',
          small_category:'',
          big_category_name:'',
          small_category_name:'',
          language_desc:'',
          // status:3
        };
      },
      getDepartment() {
        departmentList({page:1,pageSize:9999}).then(res => {
          let departmentList = res.data.filter(item=>item.list.length>0).map(item=>{return item.list});
          departmentList = Array.prototype.concat.apply([],departmentList);
           this.departmentList= departmentList.filter(item=>{
             if(item.id != this.temp.departmentId){
               return item;
             }
           });
          console.log( this.departmentList)
        });
      },
      getLanguage() {
        languageList({page:1,pageSize:99999}).then(res => {
          this.languageList = res.data.data
        });
      },
      onSubmit(){
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.paraLoading = true;
            // let temp = JSON.parse(JSON.stringify(this.temp));
            // id:'',
            //   big_category:'',
            //   small_category:'',
            //   big_category_name:'',
            //   small_category_name:'',
            //   language_desc:'',
            console.log(this.temp)
            let {id,big_category,small_category,language_desc} = this.temp;
            let temp = {id,big_category,small_category,language_desc};
            collectApplyAssist(temp).then((res) => {
              setTimeout(() => {
                this.paraLoading = false
              }, 1000)
              if (res.code == 1) {
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
