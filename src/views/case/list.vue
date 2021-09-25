<template>
  <div class="app-container">

    <div class="p20 bg_white">
      <div class="mb_10">
        <el-button class="btn_blue02" type="primary"  @click="">导出</el-button>
        <el-form :inline="true" :model="listQuery" :label="280" class="fr">
          <el-form-item label="">
            <el-input v-model="listQuery.key_word" placeholder="" clearable/>
          </el-form-item>
          <el-form-item>
            <el-button class="btn_blue02" type="primary" @click="handleFilter">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table v-loading="listLoading" :data="list" :height="tableHeight" border :header-cell-style="{background:'rgb(163,192,237)',}"
                element-loading-text="拼命加载中" fit ref="tableList" @row-click="handleView">
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column label="案件编号" align="center" prop="order_no"></el-table-column>
        <el-table-column label="任务号" align="center" prop="number_no"></el-table-column>
        <el-table-column label="大类" align="center" prop="big_category_name"></el-table-column>
        <el-table-column label="小类" align="center" prop="small_category_name"></el-table-column>
        <el-table-column label="审核时间" align="center" prop="check_time" :formatter="formatTime"></el-table-column>
        <el-table-column label="剩余时间" align="center" prop="residue_time"></el-table-column>
        <el-table-column label="紧急案件" align="center" prop="is_importance" :formatter="formatImportant"></el-table-column>
        <el-table-column label="问题描述" align="center" prop="description"></el-table-column>
        <el-table-column label="状态" align="center" prop="status" :formatter="formatStatus"></el-table-column>
        <el-table-column label="事件位置" align="center" prop="address"></el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize"
                  @pagination="getList" class="text-right"/>
    </div>

<!--    根据不同状态显示不同详情页-->
<!--    待审核状态-->
    <examineView :showDialog.sync="showExamineDialog" :paraData="viewData" @updateList="getList"></examineView>
    <!--    待派遣状态-->
    <dispatchView :showDialog.sync="showDispatchDialog" :paraData="viewData" @updateList="getList"></dispatchView>
    <!--    待协办-->
    <assistView :showDialog.sync="showAssistDialog" :paraData="viewData" @updateList="getList"></assistView>
    <!--    待结案-->
    <endView :showDialog.sync="showEndDialog" :paraData="viewData" @updateList="getList"></endView>
    <!--    待处置-->
    <disposalView :showDialog.sync="showDisposalDialog" :paraData="viewData" @updateList="getList"></disposalView>
    <!--    待协办申请-->
    <assistApplyView :showDialog.sync="showAssistApplyDialog" :paraData="viewData" @updateList="getList"></assistApplyView>
<!--    assistList-->
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import Pagination from "@/components/Pagination/index";
  import examineView from "./../examine/components/view";
  import dispatchView from "./../dispatch/components/view";
  import assistView from "./../assist/components/view";
  import endView from "./../end/components/view";
  import disposalView from "./../disposal/components/view";
  import assistApplyView from "./../assistApply/components/view";
  import {collectList} from "@/api/collect";
  export default {
    name: 'caseList',
    components: {
      Pagination,
      examineView,
      dispatchView,
      assistView,
      endView,
      disposalView,
      assistApplyView
    },
    data() {
      return {
        showExamineDialog:false,
        showDispatchDialog:false,
        showAssistDialog:false,
        showEndDialog:false,
        showDisposalDialog:false,
        showAssistApplyDialog:false,
        viewData:{
          id:''
        },
        showViewDialog:false,
        paraData:{
          id:''
        },
        total: 0,
        list: [],
        listLoading: false,
        listQuery: {
          key_word: '',
          page: 1,
          pageSize: 10
        },
        tableHeight:'100'
      }
    },
    computed: {
      ...mapState({
        roles: state => state.user.roles,
      }),
    },
    mounted() {
      this.$nextTick(function() {
        // this.$refs.filter-container.offsetHeight
        let height = window.innerHeight - this.$refs.tableList.$el.offsetTop - 190;
        if(height>300){
          this.tableHeight = height
        }else{
          this.tableHeight = 300
        }
        // 监听窗口大小变化
        const self = this;
        window.onresize = function() {
          let height = window.innerHeight - self.$refs.tableList.$el.offsetTop - 190;
          if(height>300){
            self.tableHeight = height
          }else{
            self.tableHeight = 300
          }
        };
      });
      this.getList();
    },
    methods: {
      formatTime(row, column, cellValue, index) {
        return cellValue
          ? this.$moment(cellValue).format("YYYY-MM-DD HH:mm:ss")
          : "暂无";
      },
      formatSource(row, column, cellValue, index) {
        return cellValue == 1
          ? "问题登记"
          : cellValue == 2
            ? "AI识别"
            : "--";
      },
      formatImportant(row, column, cellValue, index) {
        return cellValue == 1
          ? "是"
          : cellValue == 2
            ? "否"
            : "--";
      },
      formatStatus(row, column, cellValue, index) {
        // 1、待审核  2、待派遣 3、待协办申请  4、转办  5、待协办 6、协办 7、待处置  8、待结案  9、结案  0、废弃（操作状态）
        // 0、废弃    1、待审核   2、待派遣  （3、4、5、6） 3、待处置  4、待协办申请  5  待结案 6、 结案  7、废弃 （事件状态）
        // let StatusArr = { 1:'待审核',2:'待派遣', 3:'待处置',4:'待协办申请', 5:'待结案',6:'结案', 7:'废弃',};
        return cellValue == 7
          ? "废弃"
          : cellValue == 1
          ? "待审核"
          : cellValue == 2
            ? "待派遣"
              : cellValue == 3
                ? "待处置"
                : cellValue == 4
                  ? "待协办申请"
                  : cellValue == 5
                    ? "待结案"
                    : cellValue == 6
                      ? "结案"
            : "--";
      },
      handleFilter() {
        this.listQuery.page = 1;
        this.getList()
      },
      getList() {
        collectList(this.listQuery).then(res => {
          this.list = res.data.data
          this.total = res.data.total
        });
      },
      handleView(row, column, event){
        // 1、待审核  2、待派遣 3、待协办申请  4、转办  5、待协办 6、协办 7、待处置  8、待结案  9、结案  0、废弃
        // 0、废弃    1、待审核   2、待派遣  （3、4、5、6） 3、待处置  4、待结案  5  结案 （事件状态）
        // this.showViewDialog = true
        if(row.status == 1){
          this.showExamineDialog = true;
        }else if(row.status == 2){
          this.showDispatchDialog = true;
        }else if(row.status == 3){
          this.showDisposalDialog = true;
        }else if(row.status == 4){
          this.showEndDialog = true;
        }else if(row.status == 5){
          this.showEndDialog = true;
        }

        this.viewData = {
          id:row.id,
          order_no:row.order_no,
          option: {
            big_category_name:row.big_category_name,
            small_category_name:row.small_category_name,
          },
        }
      },
    }
  }
</script>
<style lang="scss" scoped>
  .monitor_num{
    line-height: 2.5;
  }
  .red_circle{
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: red;
  }
  .yellow_circle{
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: yellow;
  }
</style>
