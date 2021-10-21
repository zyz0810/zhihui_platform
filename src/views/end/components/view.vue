<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="80%"
    @close="close"
    top="4vh"
    title="详情"
    class="dialogContainer"
    @open="open"
  >
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="详细信息" name="first">
        <div class="mb_20">
          <span>派遣时间：{{formData.send_check_time ? $moment(Number(formData.send_check_time)*1000).format("YYYY-MM-DD HH:mm:ss"):'--'}}</span>
          <span class="ml_30">截止时间：{{formData.expire_time ? $moment(Number(formData.expire_time)*1000).format("YYYY-MM-DD HH:mm:ss"):'--'}}</span>
          <span class="ml_30">剩余处理时间：{{formData.residue_time}}</span>
        </div>
        <el-descriptions class="margin-top" title="" :column="3" size="medium" border>
          <el-descriptions-item>
            <template slot="label">案件编号</template>
            {{formData.order_no}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">审核时间</template>
            {{formData.check_time ? $moment(Number(formData.check_time)*1000).format("YYYY-MM-DD HH:mm:ss"):'--'}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">事件状态</template>
            {{formData.status | filtersStatus}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">事件大类</template>
            {{formData.big_category_name}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">事件小类</template>
            {{formData.small_category_name}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">是否紧急事件</template>
            {{formData.is_importance | filtersImportant}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">事件来源</template>
            {{formData.source | filtersSource}}
          </el-descriptions-item>

          <el-descriptions-item v-if="formData.source == 1">
            <template slot="label">举报人</template>
            {{formData.report}}
          </el-descriptions-item>
          <el-descriptions-item v-if="formData.source == 1">
            <template slot="label">联系电话</template>
            {{formData.mobile}}
          </el-descriptions-item>

          <el-descriptions-item v-if="formData.source == 2">
            <template slot="label">设备名称</template>
            {{formData.facility_name}}
          </el-descriptions-item>
          <el-descriptions-item v-if="formData.source == 2">
            <template slot="label">所属中队</template>
            {{formData.ai_depart_name}}
          </el-descriptions-item>
          <el-descriptions-item :span="3">
            <template slot="label">事件位置</template>
            {{formData.address}}
          </el-descriptions-item>
          <el-descriptions-item :span="3">
            <template slot="label">情况描述</template>
            {{formData.description}}
          </el-descriptions-item>
          <el-descriptions-item :span="3">
            <template slot="label">问题图片</template>
            <img v-for="item in formData.before_images" :src="item" class="my_img fl mr_10"/>
          </el-descriptions-item>


          <el-descriptions-item :span="3">
            <template slot="label">主办部门</template>
            {{formData.main.main_department_name}}
          </el-descriptions-item>
          <el-descriptions-item :span="3">
            <template slot="label">处置时间</template>
            {{formData.main.create_at ? $moment(Number(formData.main.create_at)*1000).format("YYYY-MM-DD HH:mm:ss"):'--'}}
          </el-descriptions-item>
          <el-descriptions-item :span="3">
            <template slot="label">处置说明</template>
            {{formData.main.language_desc}}
          </el-descriptions-item>
          <el-descriptions-item :span="3">
            <template slot="label">处置图片</template>
            <img v-for="item in formData.main.after_images" :src="item" class="my_img fl mr_10"/>
          </el-descriptions-item>
          <el-descriptions-item :span="3">
            <template slot="label">协办部门</template>
            {{formData.assist.main_department_name}}
          </el-descriptions-item>
          <el-descriptions-item :span="3">
            <template slot="label">处置时间</template>
            {{formData.assist.create_at ? $moment(Number(formData.assist.create_at)*1000).format("YYYY-MM-DD HH:mm:ss"):'--'}}
          </el-descriptions-item>
          <el-descriptions-item :span="3">
            <template slot="label">处置说明</template>
            {{formData.assist.language_desc}}
          </el-descriptions-item>
          <el-descriptions-item :span="3">
            <template slot="label">处置图片</template>
            <img v-for="item in formData.assist.after_images" :src="item" class="my_img fl mr_10"/>
          </el-descriptions-item>


        </el-descriptions>
      </el-tab-pane>
      <el-tab-pane label="办理进度" name="second">
        <el-table v-loading="listLoading" :data="list" :height="tableHeight" border :header-cell-style="{background:'rgb(163,192,237)',}"
                  element-loading-text="拼命加载中" fit ref="tableList">
          <el-table-column label="处置人员" align="center" prop="user_name" sortable></el-table-column>
          <el-table-column label="处置部门" align="center" prop="depart_name" sortable></el-table-column>
          <!--<el-table-column label="对象" align="center" prop="source"></el-table-column>-->
          <el-table-column label="操作" align="center" prop="status_name"></el-table-column>
          <el-table-column label="操作时间" align="center" prop="create_at" :formatter="formatTime"></el-table-column>
          <el-table-column label="意见说明" align="center" prop="language_desc"></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <div slot="footer" class="dialog-footer">
      <el-button type="warning" @click="handleOperation(0)">驳回</el-button>
      <el-button type="primary" @click="handleOperation(1)">结案</el-button>
    </div>
    <adoptView :showDialog.sync="showAdoptDialog" :paraData="viewData" @updateView="showViewDialog = false"></adoptView>
  </myDialog>
</template>

<script>
  import {paraValueList,paraValueSave,paraValueUpdate,paraValueDelete} from '@/api/parameter'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import Pagination from "@/components/Pagination/index"; // waves directive
  import SingleImage from "@/components/Upload/SingleImage.vue"; // waves directive
  import adoptView from "./adopt"; // waves directive
  import abandonedView from "./abandoned"; // waves directive
  import {collectView, stepLog} from "@/api/collect"; // waves directive
  export default {
    name: 'parameterView',
    directives: { waves },
    components: {
      draggable,
      Pagination,
      SingleImage,
      adoptView,
      abandonedView,
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
          id: "",
          order_no:''
        }
      }
    },
    data() {
      return {
        viewData:{},
        tableHeight:200,
        formData:{
          id:'',
          order_no:'',
          check_time:'',
          status:'',
          big_category_name:'',
          small_category_name:'',
          is_importance:'',
          source:'',
          report:'',
          mobile:'',
          facility_name:'',
          ai_depart_name:'',
          address:'',
          description:'',
          before_images:[],
          send_check_time:'',
          expire_time:'',
          residue_time:'',
          main:{},
          assist:{},
        },
        showDispatchDialog:false,
        listLoading:false,
        list: [],
        activeName:'first',
        showAdoptDialog:false,
        showAbandonedDialog:false,
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
    filters:{
      filtersStatus: function(value) {
        // 过程
        // 1、待审核  2、待派遣 3、待协办申请  4、转办  5、待协办 6、协办 7、待处置  8、待结案  9、结案  0、废弃
        let StatusArr = { 1:'待审核',2:'待派遣', 3:'待协办申请',4:'转办', 5:'待协办',6:'协办', 7:'待处置', 8:'待结案',9:'结案', 0:'废弃'};
        return StatusArr[value]
      },
      filtersImportant: function(value) {
        let StatusArr = { 1:'是',2:'否',};
        return StatusArr[value]
      },
      filtersSource: function(value) {
        let StatusArr = { 1:'问题登记',2:'AI识别',};
        return StatusArr[value]
      },
    },
    methods: {
      formatTime(row, column, cellValue, index) {
        return cellValue
          ? this.$moment(cellValue).format("YYYY-MM-DD HH:mm:ss")
          : "暂无";
      },
      getStepLog(){
        stepLog({order_no:this.paraData.order_no}).then(res => {
          this.list=res.data
        });
      },
      handleOperation(type){
        this.showAdoptDialog = true
        this.viewData = {
          id:this.paraData.id,
          operatorType:type
        }
      },
      getView(){
        collectView({id:this.paraData.id}).then(res => {
          const {id,order_no,check_time,main,assist,status,big_category_name,small_category_name,is_importance,source,report,mobile,facility_name,ai_depart_name,description,address,before_images,send_check_time,expire_time,residue_time} = res.data
          this.formData = {id,order_no,check_time,main,assist,status,big_category_name,small_category_name,is_importance,source,report,mobile,facility_name,ai_depart_name,description,address,before_images,send_check_time,expire_time,residue_time}
        });
      },
      handleClick(){},

      open(){
        this.$nextTick(function() {
          // this.$refs.filter-container.offsetHeight
          let height = window.innerHeight - this.$refs.tableList.$el.offsetTop - 390;
          if(height>100){
            this.tableHeight = height
          }else{
            this.tableHeight = 100
          }
          // 监听窗口大小变化
          const self = this;
          window.onresize = function() {
            let height = window.innerHeight - self.$refs.tableList.$el.offsetTop - 390;
            if(height>100){
              self.tableHeight = height
            }else{
              self.tableHeight = 100
            }
          };
        });
        this.getView();
        this.getStepLog();
      },
      close(){
        this.$emit('updateList');
        this.viewData={};
        this.tableHeight=200;
        this.formData={
          id:'',
          order_no:'',
          check_time:'',
          status:'',
          big_category_name:'',
          small_category_name:'',
          is_importance:'',
          source:'',
          report:'',
          mobile:'',
          facility_name:'',
          ai_depart_name:'',
          address:'',
          description:'',
          before_images:[],
          send_check_time:'',
          expire_time:'',
          residue_time:'',
          main:{},
          assist:{},
        };
        this.showDispatchDialog=false;
        this.listLoading=false;
        this.list= [];
        this.activeName='first';
        this.showAdoptDialog=false;
        this.showAbandonedDialog=false;
      },
    }
  }
</script>
