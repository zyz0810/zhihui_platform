<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="80%"
    @close="close"
    top="10vh"
    title="案件详情"
    class="dialogContainer"
    @open="open"
  >
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="详细信息" name="first">
        <el-descriptions class="margin-top" title="" :column="3" size="medium" border>
          <el-descriptions-item>
            <template slot="label">案件编号</template>
            {{formData.number_no}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">审核时间</template>
            字段是啥？？
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">事件状态</template>
            {{formData.status}}
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
            {{formData.is_importance}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">事件来源</template>
            {{formData.source}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">设备名称</template>
            字段是啥？？
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">所属中队</template>
            字段是啥？？
          </el-descriptions-item>
          <el-descriptions-item :span="3">
            <template slot="label">情况描述</template>
            {{formData.description}}
          </el-descriptions-item>
          <el-descriptions-item :span="3">
            <template slot="label">事件位置</template>
            {{formData.address}}
          </el-descriptions-item>
          <el-descriptions-item :span="3">
            <template slot="label">问题图片</template>
            字段是啥？？
            <image v-for="item in formData.after_images" :scr="item"></image>
          </el-descriptions-item>
        </el-descriptions>
      </el-tab-pane>
      <el-tab-pane label="办理进度（没接口）" name="second">
        <el-table v-loading="listLoading" :data="list" :height="tableHeight" border :header-cell-style="{background:'rgb(163,192,237)',}"
                  element-loading-text="拼命加载中" fit ref="tableList">
          <el-table-column label="处置人员" align="center" prop="user_name" sortable></el-table-column>
          <el-table-column label="处置部门" align="center" prop="depart_name" sortable></el-table-column>
          <!--<el-table-column label="对象" align="center" prop="source"></el-table-column>-->
          <el-table-column label="操作" align="center" prop="status_name"></el-table-column>
          <el-table-column label="操作时间" align="center" prop="create_at"></el-table-column>
          <el-table-column label="意见说明" align="center" prop="language_desc"></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleAbandoned">废弃</el-button>
      <el-button type="warning" @click="handleTransfer">转办（没接口）</el-button>
      <el-button type="info" @click="handleJointly">申请协办（没接口）</el-button>
      <el-button type="primary" @click="handleDispatch">派遣（没接口）</el-button>
      <el-button type="success" @click="">打 印</el-button>
    </div>
    <!--废弃-->
    <abandonedView :showDialog.sync="showAbandonedDialog" :paraData="viewData"></abandonedView>
    <!--转办-->
    <transferView :showDialog.sync="showTransferDialog" :paraData="viewData"></transferView>
    <!--申请协办-->
    <jointlyView :showDialog.sync="showJointlyDialog" :paraData="viewData"></jointlyView>
    <!--派遣-->
    <dispatchView :showDialog.sync="showDispatchDialog" :paraData="viewData"></dispatchView>
  </myDialog>
</template>

<script>
  import map from '@/components/Map/map' // 引入刚才的map.js 注意路径
  import {paraValueList,paraValueSave,paraValueUpdate,paraValueDelete} from '@/api/parameter'
  import { collectView,stepLog} from '@/api/collect'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import Pagination from "@/components/Pagination/index"; // waves directive
  import SingleImage from "@/components/Upload/SingleImage.vue"; // waves directive
  import adoptView from "./adopt"; // waves directive
  import abandonedView from "./abandoned"; // waves directive
  import transferView from "./transferView"; // waves directive
  import jointlyView from "./jointlyView"; // waves directive
  import dispatchView from "./dispatchView"; // waves directive
  export default {
    name: 'parameterView',
    directives: { waves },
    components: {
      draggable,
      Pagination,
      SingleImage,
      adoptView,
      abandonedView,
      transferView,
      jointlyView,
      dispatchView
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
          order_no:'',
          option: {},
          operatorType: "view",
          id: ""
        }
      }
    },
    data() {
      return {
        viewData:{},
        formData:{},
        listLoading:false,
        tableHeight:200,
        list: [],
        activeName:'first',
        showAbandonedDialog:false,
        showTransferDialog:false,
        showJointlyDialog:false,
        showDispatchDialog:false,
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
        let StatusArr = {0:'禁用', 1:'启用'}
        return StatusArr[value]
      }
    },
    methods: {
      handleAbandoned(){
        this.showAbandonedDialog = true;
        this.viewData = {
          id:this.paraData.id,
          // operatorType:type,
          status:this.formData.status,
          option:{
            big_category_name:'',
            small_category_name:'',
          }
        }
      },
      handleTransfer(){
        this.showTransferDialog = true;
        this.viewData = {
          id:this.paraData.id,
          // operatorType:type,
          status:this.formData.status,
          option:{
            big_category_name:'',
            small_category_name:'',
          }
        }
      },
      handleJointly(){
        this.showJointlyDialog = true;
        this.viewData = {
          id:this.paraData.id,
          operatorType:type,
          status:this.formData.status,
          option:{
            big_category_name:'',
            small_category_name:'',
          }
        }
      },
      handleDispatch(){
        this.showDispatchDialog = true;
        this.viewData = {
          id:this.paraData.id,
          operatorType:type,
          status:this.formData.status,
          option:{
            big_category_name:'',
            small_category_name:'',
          }
        }
      },
      handleClick(){},
      getView(){
        collectView({id:this.paraData.id}).then(res => {
          const {id,order_no,create_at,status, big_category_name,small_category_name,is_importance,source,report,mobile,address,description,before_images} = res.data
          this.formData = {id,order_no,create_at,status, big_category_name,small_category_name,is_importance,source,report,mobile,address,description,before_images}
        });
      },
      getStepLog(){
        stepLog({order_no:this.paraData.order_no}).then(res => {
          this.list=rea.data
        });
      },
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
      close(){},


    }
  }
</script>
