<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="50%"
    @close="close"
    top="10vh"
    title="转办"
    class="dialogContainer"
    :append-to-body="true"
    @open="open"
  >
    <el-form ref="dataForm" :rules="rules" :inline="true" :model="temp" label-width="120px" class="mt_20">
      <el-form-item label="大类" prop="big_category_name">
        <el-input v-model="temp.big_category_name" placeholder="" :disabled="true" clearable/>
      </el-form-item>
      <el-form-item label="小类" prop="small_category_name">
        <el-input v-model="temp.small_category_name" placeholder="" :disabled="true" clearable/>
      </el-form-item>
      <el-form-item label="转办部门" prop="depart_id">
        <el-select v-model="temp.depart_id">
          <el-option v-for="item in departmentList" :label="item.department_name" :value="item.id"></el-option>
        </el-select>
<!--                <el-cascader ref="cascaderPublish"-->
<!--                             v-model="temp.depart_id"-->
<!--                             :options="departmentList"-->
<!--                             :show-all-levels="false"-->
<!--                             filterable-->
<!--                             :props="props"-->
<!--                             @change="categoryChange"-->
<!--                             placeholder="请选择"></el-cascader>-->
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
  import {languageList, departmentList, allDepartmentTreeList} from "@/api/system"; // waves directive
  import {collectStatus, collectTurnDeal} from "@/api/collect"; // waves directive

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
          big_category:'',
          small_category:'',
          big_category_name:'',
          small_category_name:'',
          depart_id:[],
          language_desc:'',
          status:4
        },
        rules: {
          name: [{ required: true, message: '请输入名称', trigger: 'change' }],
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
      categoryChange(val){

      },
      open(){
        this.getLanguage();
        this.getDepartment();
        this.temp.id = this.paraData.id;
        this.temp.big_category_name = this.paraData.option.big_category_name;
        this.temp.small_category_name = this.paraData.option.small_category_name;
        this.temp.big_category = this.paraData.option.big_category;
        this.temp.small_category = this.paraData.option.small_category;
      },
      close(){
        this.languageList=[];
        this.departmentList=[];
        this.paraLoading=false;
        this.temp= {
          big_category:'',
          small_category:'',
          big_category_name:'',
          small_category_name:'',
          depart_id:[],
          language_desc:'',
          status:4
        };
      },
      getDepartment() {
        // departmentList({page:1,pageSize:9999}).then(res => {
        //   // let departmentList = res.data.filter(item=>item.list.length>0).map(item=>{return item.list});
        //   // departmentList = Array.prototype.concat.apply([],departmentList);
        //   //  this.departmentList= departmentList.filter(item=>{
        //   //    if(item.id != this.temp.departmentId){
        //   //      return item;
        //   //    }
        //   //  });
        //   // console.log( this.departmentList)
        //   this.departmentList = res.data
        // });
        allDepartmentTreeList({parent_id:1}).then(res => {
          this.departmentList = res.data;
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
            // depart_id
            let temp = JSON.parse(JSON.stringify(this.temp));
            // temp.depart_id =  temp.depart_id[temp.depart_id.length - 1];
            collectTurnDeal(temp).then((res) => {
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
