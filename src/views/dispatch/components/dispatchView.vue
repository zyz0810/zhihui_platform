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
      <el-form-item label="主办部门" prop="main_department">
<!--        <el-select v-model="temp.add_department" @change="changeDepartment">-->
<!--          <el-option v-for="item in departmentList" :label="item.department_name" :value="item.id"></el-option>-->
<!--        </el-select>-->
        <el-cascader ref="cascaderPublish"
                     v-model="temp.main_department"
                     :options="firstDepartmentList"
                     :show-all-levels="false"
                     filterable
                     :props="props"
                     clearable
                     v-if="mainDepartment"
                     @change="changeDepartment"
                     placeholder="请选择"></el-cascader>
        <el-select v-model="temp.main_people" @change="changeUser" v-if="mainUser" clearable>
          <el-option v-for="item in firstUserList" :label="item.real_name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="协办部门" prop="assist_department">
<!--        <el-select v-model="temp.assist_department">-->
<!--          <el-option v-for="item in departmentList" :label="item.department_name" :value="item.id"></el-option>-->
<!--        </el-select>-->

        <el-cascader ref="cascaderPublish"
                     v-model="temp.assist_department"
                     :options="secondDepartmentList"
                     :show-all-levels="false"
                     filterable
                     :props="props"
                     v-if="mainDepartment"
                     clearable
                     @change="changeSecondDepartment"
                     placeholder="请选择"></el-cascader>
        <el-select v-model="temp.assist_people" v-if="mainUser" @change="changeSecondUser" clearable>
          <el-option v-for="item in secondUserList" :label="item.real_name" :value="item.id"></el-option>
        </el-select>

      </el-form-item>
      <el-form-item label="处理时限">
<!--        {{temp.time}}小时-->
        <el-input v-model="temp.time" placeholder="" clearable/> 秒
      </el-form-item>
      <el-form-item label="说明" prop="language_desc" clearable>
        <el-select v-model="temp.language_desc" filterable allow-create>
          <el-option v-for="item in languageList" :label="item.language" :value="item.language"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否为紧急案件" prop="is_importance" clearable>
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
  import {languageList,allDepartmentTreeList,departmentUserList,categoryDetail,departmentList} from "@/api/system"; // waves directive
  import {collectAssist, sendCollectList,sendCollect} from "@/api/collect"; // waves directive
  import {getInfo, } from "@/api/user"; // waves directive
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
        props: {
          checkStrictly: true,
          expandTrigger: "hover",
          value: "id",
          label: "department_name",
          children: "list",
          disabled: false,
        },
        firstUserList:[],
        mainDepartment:false,
        mainUser:false,
        assDepartmentList:[],
        secondDepartmentList:[],
        languageList:[],
        departmentList:[],
        userList:[],
        paraLoading:false,
        // main、main_people、assist、language_id、is_importance
        // 'assist_people' => '协办人',
        // 'assist_department' => '协办部门',
        // 'main_people' => '主办人',
        // 'main_department' => '主办部门',
        temp: {
          id:'',
          big_category:'',
          small_category:'',
          big_category_name:'',
          small_category_name:'',
          assist_people:'',
          assist_department:'',
          main_people:'',
          main_department:'',
          language_desc:'',
          is_importance:1,
          time:''
        },
        firstDepartmentList:[],
        secondUserList:[],
        myDepartment_id:'',
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

        this.getMyDepart();

        this.temp.id = this.paraData.id;
        this.temp.big_category_name = this.paraData.option.big_category_name;
        this.temp.small_category_name = this.paraData.option.small_category_name;
        this.temp.big_category = this.paraData.option.big_category;
        this.temp.small_category = this.paraData.option.small_category;
        this.getTime(this.paraData.option.small_category);
      },
      close(){
        this.firstUserList=[];
        this.mainDepartment=false;
        this.mainUser=false;
        this.assDepartmentList=[];
        this.secondDepartmentList=[];
        this.languageList=[];
        this.departmentList=[];
        this.userList=[];
        this.paraLoading=false;
        // main、main_people、assist、language_id、is_importance
        // 'assist_people' => '协办人',
        // 'assist_department' => '协办部门',
        // 'main_people' => '主办人',
        // 'main_department' => '主办部门',
        this.temp= {
          id:'',
          big_category:'',
          small_category:'',
          big_category_name:'',
          small_category_name:'',
          assist_people:'',
          assist_department:'',
          main_people:'',
          main_department:'',
          language_desc:'',
          is_importance:1,
          time:''
        };
        this.firstDepartmentList=[];
        this.secondUserList=[];
        this.myDepartment_id='';
      },
      getMyDepart(){
        getInfo().then(res => {
          this.myDepartment_id = res.data.department_id;
          this.getDepartment(res.data.department_id)
          // this.getDepartment(20)
        });
      },
      changeDepartment(val){
        // this.temp.assist_department = [];
        if(val[val.length - 1] == this.myDepartment_id){
          this.temp.assist_department = val;
        }else{
          this.secondDepartmentList = this.departmentList.filter(item=>{ return item.id!=val[val.length - 1]});
          // this.temp.assist_department = [];
          // this.secondUserList = this.userList.filter(item=>{ return item.id!=this.temp.main_people})
        }
        // this.getUser(val[val.length-1])
      },
      changeSecondDepartment(val){
        this.firstDepartmentList = this.departmentList.filter(item=>{ return item.id!=val[val.length - 1]});
      },
      changeUser(val){
        // this.temp.assist_people = '';
        this.secondUserList = this.userList.filter(item=>{ return item.id!=val})
      },
      changeSecondUser(val){
        this.firstUserList = this.userList.filter(item=>{ return item.id!=val})
      },
      getTime(val){
        categoryDetail({id:val}).then(res => {
          this.temp.time = res.data.send_time;
          // this.departmentList = res.data;
          // console.log( this.departmentList)
        });
      },

      getDepartment(id) {
        if(id==1){//如果是受理中心，就直接展示二级
          allDepartmentTreeList({parent_id:id}).then(res => {
            // let departmentList = res.data.filter(item=>item.list.length>0).map(item=>{return item.list});
            // departmentList = Array.prototype.concat.apply([],departmentList);
            //  this.departmentList= departmentList.filter(item=>{
            //    if(item.id != this.temp.departmentId){
            //      return item;
            //    }
            //  });
            this.departmentList = res.data;
            this.firstDepartmentList = res.data;
            this.secondDepartmentList = res.data;
            this.mainDepartment = true;
            this.mainUser = false;
            console.log( this.departmentList)
          });
        }else{//如果是二级，就直接选择本部门人员
          this.mainDepartment = false;
          this.mainUser = true;
          this.temp.assist_department = id;
          this.temp.main_department = id;
          this.getUser(id);
        }

      },
      getUser(id){
        departmentUserList({department_id:id,}).then(res => {
          this.userList = res.data;
          this.firstUserList = res.data;
          this.secondUserList = res.data;
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
            // id:'',
            //   big_category:'',
            //   small_category:'',
            //   big_category_name:'',
            //   small_category_name:'',
            //   assist_people:'',
            //   assist_department:'',
            //   main_people:'',
            //   main_department:'',
            //   language_desc:'',
            //   is_importance:1,
            //   time:''
            console.log(this.temp)
            const {id,big_category,small_category,assist_people,main_people,language_desc,is_importance,time} = this.temp;
            let assist_department = this.temp.assist_department[this.temp.assist_department.length-1];
            let main_department = this.temp.main_department[this.temp.main_department.length-1];
            // let time = Number(this.temp.time*3600);
            const temp =  {id,big_category,small_category,main_department,assist_people,assist_department,main_people,main_department,language_desc,is_importance,time};
            console.log(temp)
            console.log(assist_department)

            this.paraLoading = true;
            sendCollect(temp).then((res) => {
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
