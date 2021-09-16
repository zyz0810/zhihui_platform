<template>
  <div class="app-container">

    <div class="p20 bg_white">
      <div class="mb_10">
        <div class="fl monitor_num f14 mr_10">今日立案数：59</div>
<!--        <el-button class="btn_blue02" type="primary"  @click="">导出</el-button>-->
        <el-form :inline="true" :model="listQuery" :label="280" class="fr">
          <el-form-item label="">
            <el-input v-model="listQuery.productSn" placeholder="" @change="handleFilter" clearable/>
          </el-form-item>
          <el-form-item>
            <el-button class="btn_blue02" type="primary" @click="handleFilter">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table v-loading="listLoading" :data="list" :height="tableHeight" border :header-cell-style="{background:'rgb(163,192,237)',}"
                element-loading-text="拼命加载中" fit ref="tableList" @row-click="handleView">
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column label="任务号" align="center" prop="order_no"></el-table-column>
        <el-table-column label="事件来源" align="center" prop="source"></el-table-column>
        <el-table-column label="大类" align="center" prop="big_category_name"></el-table-column>
        <el-table-column label="小类" align="center" prop="small_category_name"></el-table-column>
        <el-table-column label="是否紧急事件" align="center" prop="is_importance"></el-table-column>
        <el-table-column label="上报时间字段是啥？" align="center" prop=""></el-table-column>
        <el-table-column label="事件位置" align="center" prop="address"></el-table-column>
        <el-table-column label="问题描述" align="center" prop="description"></el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                  @pagination="getList" class="text-right"/>
    </div>

    <paraView :showDialog.sync="showViewDialog" :paraData="viewData"></paraView>

  </div>
</template>

<script>
  import {paraList, paraSave, paraUpdate, paraDelete} from '@/api/parameter'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import { mapState } from 'vuex'
  import Pagination from "@/components/Pagination/index"; // waves directive
  import paraView from "./components/view";
  import {collectList} from "@/api/collect";
  export default {
    name: 'parameterList',
    directives: {waves},
    components: {
      draggable,
      Pagination,
      paraView
    },
    data() {
      return {
        showViewDialog:false,
        viewData:{
          id:''
        },
        updateBtn: true,
        enableBtn: true,
        disableBtn: true,
        total: 16,
        parameterValueList: [{name: ''}],
        list: [],
        listLoading: false,
        listQuery: {
          name: '',
          status: undefined,
          page: 1,
          limit: 10
        },
        tableHeight:'100'
      }
    },
    filters: {
      filtersStatus: function (value) {
        let StatusArr = {0: '未审核', 1: '已审核'}
        return StatusArr[value]
      },
      filtersType: function (value) {
        let StatusArr = {0: '店外经营', 1: '违规撑伞', 2: '流动摊点', 3: '沿街晾晒'}
        return StatusArr[value]
      },
      filtersSource: function (value) {
        let StatusArr = {0: '其它', 1: '滨康二区',}
        return StatusArr[value]
      },
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
        if(height>100){
          this.tableHeight = height
        }else{
          this.tableHeight = 100
        }
        // 监听窗口大小变化
        const self = this;
        window.onresize = function() {
          let height = window.innerHeight - self.$refs.tableList.$el.offsetTop - 190;
          if(height>100){
            self.tableHeight = height
          }else{
            self.tableHeight = 100
          }
        };
      });
      this.getList();
    },
    methods: {
      getList() {
        collectList(this.listQuery).then(res => {
          this.list = res.data.data
          this.total = res.data.total
        });
      },
      handleFilter() {
        this.listQuery.page = 1;
        this.getList()
      },

      handleView(row, column, event){
        this.showViewDialog = true
        this.viewData = {
          id:row.id
        }
        // console.log(row)
        // console.log(column)
        // console.log(event)
      },
    }
  }
</script>
<style lang="scss" scoped>
  .monitor_num{
    line-height: 2.5;
  }
</style>
