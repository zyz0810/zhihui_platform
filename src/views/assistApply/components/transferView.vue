<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="50%"
    @close="close"
    top="10vh"
    title="协办"
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
<!--      <el-form-item label="所属区块" prop="name">-->
<!--        <el-select v-model="temp.status">-->
<!--          <el-option v-for="item in departmentList" :label="item.department_name" :value="item.id"></el-option>-->
<!--        </el-select>-->
<!--      </el-form-item>-->
      <el-form-item label="协力部门" prop="assist_depart">
<!--        <el-select v-model="temp.assist_depart">-->
<!--          <el-option v-for="item in departmentList" :label="item.department_name" :value="item.id"></el-option>-->
<!--        </el-select>-->
        <el-cascader ref="cascaderPublish"
                     v-model="temp.assist_depart"
                     :options="departmentList"
                     :show-all-levels="false"
                     filterable
                     :props="props"
                     placeholder="请选择"></el-cascader>
      </el-form-item>
      <el-form-item label="处理时限" prop="time">
        {{temp.time}}小时
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
  import Pagination from "@/components/Pagination/index"; // waves directive
  import SingleImage from "@/components/Upload/SingleImage.vue";
  import {languageList,departmentList,categoryDetail} from "@/api/system";
  import {collectStatus,collectAssist} from "@/api/collect"; // waves directive
  export default {
    name: 'abandonedView',
    directives: { waves },
    components: {
      draggable,
      Pagination,
      SingleImage
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
          option: {
            big_category_name:'',
            small_category_name:'',
            big_category:'',
            small_category:'',
          },
          operatorType: "view",
          id: ""
        }
      }
    },
    data() {
      return {
        props: {
          checkStrictly: true,
          expandTrigger: "hover",
          value: "id",
          label: "department_name",
          children: "list",
          disabled: false,
        },
        languageList:[],
        departmentList:[],
        paraLoading:false,
        temp: {
          id:'',
          big_category_name:'',
          small_category_name:'',
          big_category:'',
          small_category:'',
          language_desc:'',
          assist_depart:[],
          time:''
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
        this.temp.id = this.paraData.id;
        this.temp.big_category_name = this.paraData.option.big_category_name;
        this.temp.small_category_name = this.paraData.option.small_category_name;
        this.getLanguage();
        this.getDepartment();
        this.temp.big_category = this.paraData.option.big_category;
        this.temp.small_category = this.paraData.option.small_category;
        this.getTime();
      },
      getTime(val){
        categoryDetail({id:this.temp.small_category}).then(res => {
          this.temp.time = res.data.send_time;
          // this.departmentList = res.data;
          // console.log( this.departmentList)
        });
      },
      close(){
        this.languageList=[];
        this.departmentList=[];
        this.paraLoading=false;
        this.temp= {
          id:'',
          big_category_name:'',
          small_category_name:'',
          big_category:'',
          small_category:'',
          language_desc:'',
          assist_depart:[],
          time:''
        };
      },
      getDepartment() {
        departmentList({page:1,pageSize:9999}).then(res => {
          // let departmentList = res.data.filter(item=>item.list.length>0).map(item=>{return item.list});
          // departmentList = Array.prototype.concat.apply([],departmentList);
          //  this.departmentList= departmentList.filter(item=>{
          //    if(item.id != this.temp.departmentId){
          //      return item;
          //    }
          //  });
          this.departmentList = res.data
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
            let temp = JSON.parse(JSON.stringify(this.temp));
            temp.assist_depart =  temp.assist_depart[temp.assist_depart.length - 1];
            temp.time = Number(this.temp.time*3600);
            collectAssist(temp).then((res) => {
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
