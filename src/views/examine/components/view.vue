<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="80%"
    @close="close"
    top="10vh"
    title="详细信息"
    class="dialogContainer"
    @open="open"
  >
    <el-descriptions class="margin-top" title="" :column="3" size="medium" border>
      <el-descriptions-item>
        <template slot="label">任务号</template>
        {{formData.order_no}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">上报时间</template>
        {{ $moment(formData.create_at).format("YYYY-MM-DD HH:mm:ss")}}
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
        <image v-for="item in formData.before_images" :scr="item" class="my_img"></image>
      </el-descriptions-item>
    </el-descriptions>
    <div slot="footer" class="dialog-footer">
      <el-button @click="showViewDialog = false">取 消</el-button>
      <el-button type="warning" @click="handleOperation(2)">废 弃</el-button>
      <el-button type="primary" @click="handleOperation(1)">通 过</el-button>
    </div>
    <adoptView :showDialog.sync="showAdoptDialog" :paraData="viewData" @updateView="getView"></adoptView>
  </myDialog>
</template>

<script>
  import { collectView,collectStatus} from '@/api/collect'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import Pagination from "@/components/Pagination/index"; // waves directive
  import SingleImage from "@/components/Upload/SingleImage.vue"; // waves directive
  import adoptView from "./adopt"; // waves directive
  export default {
    name: 'examineView',
    directives: { waves },
    components: {
      draggable,
      Pagination,
      SingleImage,
      adoptView,
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
        viewData:{
          id:'',
          operatorType:'',
        },
        showAdoptDialog:false,
        formData:{
          id:'',
          order_no:'',
          create_at:'',
          status:'',
          big_category_name:'',
          small_category_name:'',
          is_importance:'',
          source:'',
          report:'',
          mobile:'',
          address:'',
          description:'',
          before_images:[],
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
    filters:{
      filtersStatus: function(value) {
        // 1、待审核  2、待派遣 3、待协办申请  4、转办  5、待协办 6、协办 7、待处置  8、待结案  9、结案  0、废弃（操作状态）
        // 0、废弃    1、待审核   2、待派遣  （3、4、5、6） 3、待处置  4、待结案  5  结案 （事件状态）
        let StatusArr = {0:'废弃', 1:'待审核',2:'待派遣', 3:'待处置',4:'待结案', 5:'结案',};
        return StatusArr[value]
      },
      filtersSource: function(value) {
        // 1、问题登记 2、AI识别
        let StatusArr = {1:'问题登记',2:'AI识别',};
        return StatusArr[value]
      },
      filtersImportant: function(value) {
        // 1、是 2、否
        let StatusArr = {1:'是',2:'否',};
        return StatusArr[value]
      },
    },
    methods: {
      handleOperation(type){
        this.showAdoptDialog = true
        this.viewData = {
          id:this.paraData.id,
          operatorType:type,
          status:this.formData.status
        }
      },
      open(){
        this.getView();
      },
      getView(){
        collectView({id:this.paraData.id}).then(res => {
          const {id,order_no,create_at,status, big_category_name,small_category_name,is_importance,source,report,mobile,address,description,before_images} = res.data
          this.formData = {id,order_no,create_at,status, big_category_name,small_category_name,is_importance,source,report,mobile,address,description,before_images}
        });
      },
      close(){
        this.viewData={
          id:'',
          operatorType:'',
        };
        this.showAdoptDialog=false;
        this.formData={
          id:'',
          order_no:'',
          create_at:'',
          status:'',
          big_category_name:'',
          small_category_name:'',
          is_importance:'',
          source:'',
          report:'',
          mobile:'',
          address:'',
          description:'',
          after_images:[],
        };
      },
    }
  }
</script>
