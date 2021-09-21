<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="search_form">
        <el-form-item label="案件来源">
          <el-select v-model="listQuery.source" placeholder="选择巡查来源" @change="handleFilter">
            <el-option label="问题登记" value="1"></el-option>
            <el-option label="AI识别" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="案件小类">
          <el-select v-model="listQuery.status" placeholder="选择设备名称" @change="handleFilter">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间：" prop="name">
          <el-date-picker
            v-model="listQuery.yearChoose"
            clearable
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="p20 bg_white">
      <div class="mb_10">
        <el-button type="primary" icon="iconfont icon-daochu1" @click="handleView">问题登记</el-button>
        <el-button type="primary" icon="iconfont icon-daochu1" @click="">导出</el-button>
      </div>
      <el-table v-loading="listLoading" :data="list" :height="tableHeight" border :header-cell-style="{background:'rgb(163,192,237)',}"
                element-loading-text="拼命加载中" fit ref="tableList">
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column label="任务号" align="center" prop="order_no"></el-table-column>
        <el-table-column label="案件大类" align="center" prop="big_category_name"></el-table-column>
        <el-table-column label="案件小类" align="center" prop="small_category_name"></el-table-column>
        <el-table-column label="举报人" align="center" prop=" report"></el-table-column>
        <el-table-column label="举报人电话" align="center" prop="mobile"></el-table-column>
        <el-table-column label="是否紧急事件" align="center" prop="is_importance"></el-table-column>
        <el-table-column label="登记时间" align="center" prop="create_at"></el-table-column>
        <el-table-column label="事件位置" align="center" prop="address"></el-table-column>
        <el-table-column label="问题描述" align="center" prop="description"></el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize"
                  @pagination="getList" class="text-right"/>
    </div>

    <paraView :showDialog.sync="showViewDialog" :paraData="paraData" @insetList="getList"></paraView>

  </div>
</template>

<script>
  import {collectList} from '@/api/collect'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import { mapState } from 'vuex'
  import Pagination from "@/components/Pagination/index"; // waves directive
  import paraView from "./components/view";
  export default {
    name: 'registerList',
    directives: {waves},
    components: {
      draggable,
      Pagination,
      paraView
    },
    data() {
      return {
        showViewDialog:false,
        paraData:{
          id:''
        },
        updateBtn: true,
        enableBtn: true,
        disableBtn: true,
        total: 0,
        list: [],
        listLoading: false,
        listQuery: {
          source:'',
          page: 1,
          pageSize: 10
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

      resetList() {
        this.listQuery = {
          name: '',
          status: undefined,
          page: 1,
          pageSize: 10
        }
        this.getList();
      },
      clickRow(row){
        this.$refs.tableList.toggleRowSelection(row)
      },
      handleSelectionChange(val) {
        console.log(val)
        this.rowInfo = val;
        if (val.length == 1) {
          this.updateBtn = false
          this.deleteBtn = false
          if(val[0].status == 0){
            this.enableBtn = false
            this.disableBtn = true
          }else{
            this.enableBtn = true
            this.disableBtn = false
          }
        } else {
          this.updateBtn = true
          this.deleteBtn = true
          this.enableBtn = true
          this.disableBtn = true
        }
      },

      handleView(row){
        this.showViewDialog = true
        this.paraData = {
          // id:row.id
        }
      },


    }
  }
</script>
