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
      <el-form-item label="大类" prop="name">
        <el-input v-model="temp.productSn" placeholder="" :disabled="true" clearable/>
      </el-form-item>
      <el-form-item label="小类" prop="name">
        <el-input v-model="temp.productSn" placeholder="" :disabled="true" clearable/>
      </el-form-item>
<!--      <el-form-item label="所属区块" prop="name">-->
<!--        <el-select v-model="temp.status">-->
<!--          <el-option v-for="item in departmentList" :label="item.department_name" :value="item.id"></el-option>-->
<!--        </el-select>-->
<!--      </el-form-item>-->
      <el-form-item label="协力部门" prop="name">
        <el-select v-model="temp.status">
          <el-option v-for="item in departmentList" :label="item.department_name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="处理时限" prop="name">
        4小时
      </el-form-item>
      <el-form-item label="说明" prop="name">
        <el-select v-model="temp.status">
          <el-option v-for="item in languageList" :label="item.language" :value="item.id"></el-option>
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
  import {languageList,departmentList} from "@/api/system"; // waves directive
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
          name:'',
          departmentId:23,
          parameterId:undefined,
          deleted:0
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
      open(){
        this.temp.id = this.paraData.id;
        this.getLanguage();
        this.getDepartment();
      },
      close(){},
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
      onSubmit(type){},

    }
  }
</script>
