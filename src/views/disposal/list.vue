<template>
  <div class="app-container">

    <div class="p20 bg_white">
      <div class="mb_10">
        <div class="fl monitor_num f14 mr_10">今日处置数：{{total}}</div>
        <!--        <el-button class="btn_blue02" type="primary"  @click="">导出</el-button>-->
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
        <el-table-column label="" align="center" prop="is_red">
          <template slot-scope="scope">
            <span :class="['inlineBlock',scope.row.is_red == 1?'green_circle':'']"></span>
            <span :class="['inlineBlock',scope.row.is_red == 2?'yellow_circle':'']"></span>
            <span :class="['inlineBlock',scope.row.is_red == 3?'red_circle':'']"></span>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column label="案件编号" align="center" prop="order_no"></el-table-column>
        <el-table-column label="事件来源" align="center" prop="source" :formatter="formatSource"></el-table-column>
        <el-table-column label="大类" align="center" prop="big_category_name"></el-table-column>
        <el-table-column label="小类" align="center" prop="small_category_name"></el-table-column>
        <el-table-column label="是否紧急事件" align="center" prop="is_importance" :formatter="formatImportant"></el-table-column>
        <el-table-column label="派遣时间" align="center" prop="send_check_time" :formatter="formatTime"></el-table-column>
        <el-table-column label="剩余时间" align="center" prop="residue_time"></el-table-column>
        <el-table-column label="事件位置" align="center" prop="address"></el-table-column>
        <el-table-column label="问题描述" align="center" prop="description"></el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize"
                  @pagination="getList" class="text-right"/>
    </div>

    <paraView :showDialog.sync="showViewDialog" :paraData="viewData" @updateList="getList"></paraView>

  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import { mapState } from 'vuex'
  import Pagination from "@/components/Pagination/index"; // waves directive
  import paraView from "./components/view";
  import {collectList} from "@/api/collect";
  export default {
    name: 'disposalList',
    directives: {waves},
    components: {
      draggable,
      Pagination,
      paraView
    },
    data() {
      return {
        viewData:{},
        showViewDialog:false,
        total: 0,
        list: [],
        listLoading: false,
        listQuery: {
          sgin:3,
          key_word:'',
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
      formatSource(row, column, cellValue, index) {
        return cellValue == 1
          ? "问题登记"
          : cellValue == 2
            ? "AI识别"
            : "--";
      },
      formatTime(row, column, cellValue, index) {
        return cellValue
          ? this.$moment(Number(cellValue)*1000).format("YYYY-MM-DD HH:mm:ss")
          : "暂无";
      },
      formatImportant(row, column, cellValue, index) {
        return cellValue == 1
          ? "是"
          : cellValue == 2
            ? "否"
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
        this.showViewDialog = true
        this.viewData = {
          id:row.id,
          order_no:row.order_no
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
  .green_circle{
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: green;
  }
</style>
