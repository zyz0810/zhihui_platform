<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="52%"
    @close="close"
    top="10vh"
    title="派遣"
    class="dialogContainer"
    :append-to-body="true"
    @open="open"
  >
    <el-form ref="dataForm" :rules="rules" :model="temp" label-width="150px" class="mt_20 dialog_form">
      <el-form-item label="大类" prop="big_category_name">
        <el-input v-model="temp.big_category_name" placeholder="" :disabled="true" clearable/>
      </el-form-item>
      <el-form-item label="小类" prop="small_category_name">
        <el-input v-model="temp.small_category_name" placeholder="" :disabled="true" clearable/>
      </el-form-item>
      <el-form-item label="主办部门" prop="add_department">
        <el-select v-model="temp.add_department" @change="changeDepartment">
          <el-option v-for="item in departmentList" :label="item.department_name" :value="item.id"></el-option>
        </el-select>
        <el-select v-model="temp.create_people">
          <el-option v-for="item in userList" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="协办部门" prop="assist_department">
        <el-select v-model="temp.assist_department">
          <el-option v-for="item in departmentList" :label="item.department_name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="处理时限">4小时？？</el-form-item>
      <el-form-item label="说明" prop="language_desc">
        <el-select v-model="temp.language_desc" filterable allow-create>
          <el-option v-for="item in languageList" :label="item.language" :value="item.language"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否为紧急案件" prop="is_importance">
        <el-radio-group v-model="temp.is_importance">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="2">否</el-radio>
        </el-radio-group>
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
  import {languageList,departmentList,departmentUserList} from "@/api/system"; // waves directive
  import {collectAssist, sendCollectList} from "@/api/collect"; // waves directive

  export default {
    name: 'dispatchViewDialog',
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
        languageList:[],
        departmentList:[],
        userList:[],
        paraLoading:false,
        // main、main_people、assist、language_id、is_importance
        temp: {
          id:'',
          big_category_name:'',
          small_category_name:'',
          add_department:'',
          create_people:'',
          assist_department:'',
          language_desc:'',
          is_importance:1
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
        this.getLanguage();
        this.getDepartment();
        this.temp.id = this.paraData.id;
        this.temp.big_category_name = this.paraData.option.big_category_name;
        this.temp.small_category_name = this.paraData.option.small_category_name;
      },
      close(){
        this.languageList=[];
        this.departmentList=[];
        this.userList=[];
        this.paraLoading=false;
        // main、main_people、assist、language_id、is_importance
        this.temp= {
          id:'',
          big_category_name:'',
          small_category_name:'',
          add_department:'',
          create_people:'',
          assist_department:'',
          language_desc:'',
          is_importance:1
        };
      },
      changeDepartment(val){
        this.getUser(val)
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
      getUser(id){
        departmentUserList({department_id:id,}).then(res => {
          this.userList = res.data;
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
            sendCollectList(this.temp).then((res) => {
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
