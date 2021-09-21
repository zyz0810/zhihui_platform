<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="50%"
    @close="close"
    top="10vh"
    title="派遣"
    class="dialogContainer"
    :append-to-body="true"
    @open="open"
  >
    <el-form ref="dataForm" :rules="rules" :model="temp" label-width="120px" class="mt_20">
      <el-form-item label="大类" prop="big_category_name">
        <el-input v-model="temp.big_category_name" placeholder="" :disabled="true" clearable/>
      </el-form-item>
      <el-form-item label="小类" prop="small_category_name">
        <el-input v-model="temp.small_category_name" placeholder="" :disabled="true" clearable/>
      </el-form-item>
      <el-form-item label="主办部门" prop="main">
        <el-select v-model="temp.main">
          <el-option label="本单位" value="1"></el-option>
        </el-select>
        <el-select v-model="temp.main_people">
          <el-option label="处置员" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="协办部门" prop="assist">
        <el-select v-model="temp.assist">
          <el-option v-for="item in departmentList" :label="item.language" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="处理时限">4小时</el-form-item>
      <el-form-item label="说明" prop="language_id">
        <el-select v-model="temp.language_id">
          <el-option v-for="item in languageList" :label="item.language" :value="item.id"></el-option>
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
  import {languageList,departmentList} from "@/api/system"; // waves directive
  import {sendCollectList} from "@/api/system"; // waves directive

  export default {
    name: 'dispatchView.vue',
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
        // main、main_people、assist、language_id、is_importance
        temp: {
          id:'',
          main:'',
          main_people:23,
          assist:undefined,
          language_id:0,
          is_importance:1,
          big_category_name:'',
          small_category_name:'',
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
        this.getLanguage();
        this.getDepartment();
        this.temp.big_category_name = this.paraData.option.big_category_name;
        this.temp.small_category_name = this.paraData.option.small_category_name;
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
