<template>
  <div class="app-container">

    <div class="p20 bg_white">
      <div class="mb_10">
        <el-button class="btn_blue02" type="primary"  @click="handleExport">导出</el-button>
        <el-form :inline="true" :model="listQuery" :label="280" class="fr">
          <el-form-item label="">
            <el-input v-model="listQuery.key_word" placeholder="请输入问题描述" clearable/>
          </el-form-item>
          <el-form-item>
            <el-button class="btn_blue02" type="primary" @click="handleFilter">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table v-loading="listLoading" :data="list" :height="tableHeight" border :header-cell-style="{background:'rgb(163,192,237)',}"
                :row-class-name="tableRowClassName"
                element-loading-text="拼命加载中" fit ref="tableList"  @row-click="handleView">
        <el-table-column label="案件标识" align="center" prop="is_red">
          <template slot-scope="scope">
            <!--            <span :class="['inlineBlock',scope.row.is_red == 1?'green_circle':'']"></span>-->
            <!--            <span :class="['inlineBlock',scope.row.is_red == 2?'yellow_circle':'']"></span>-->
            <!--            <span :class="['inlineBlock',scope.row.is_red == 3?'red_circle':'']"></span>-->
            <span class="inlineBlock green_circle" v-if="scope.row.is_red == 1"></span>
            <span class="inlineBlock yellow_circle" v-if="scope.row.is_red == 2"></span>
            <span class="inlineBlock red_circle" v-if="scope.row.is_red == 3"></span>
          </template>
        </el-table-column>
        <el-table-column label="序号" width="80" align="center">
          <template slot-scope="scope">
            {{(listQuery.page - 1) * listQuery.pageSize + scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column label="案件编号" align="center" prop="number_no"></el-table-column>
        <el-table-column label="事件来源" align="center" prop="source" :formatter="formatSource"></el-table-column>
        <el-table-column label="大类" align="center" prop="big_category_name" show-overflow-tooltip></el-table-column>
        <el-table-column label="小类" align="center" prop="small_category_name" show-overflow-tooltip></el-table-column>
        <el-table-column label="是否紧急事件" align="center" prop="is_importance" :formatter="formatImportant"></el-table-column>
        <el-table-column label="派遣时间" align="center" prop="check_send_time" :formatter="formatTime"></el-table-column>
        <el-table-column label="剩余时间" align="center" prop="residue_time"></el-table-column>
        <el-table-column label="处置部门" align="center" prop="deal_department"></el-table-column>
        <el-table-column label="事件位置" align="center" prop="address" show-overflow-tooltip></el-table-column>
        <el-table-column label="问题描述" align="center" prop="description" show-overflow-tooltip></el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize"
                  @pagination="getList" class="text-right"/>
    </div>

    <paraView :showDialog.sync="showViewDialog" :paraData="viewData" @updateList="getListTimer"></paraView>
    <a v-show="false" :href="downLoadUrl" id="fileDownload"></a>
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
  import store from "@/store";
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
        viewData:{
          id:'',
          order_no:'',
          option: {
            type:'view',
          }
        },
        showViewDialog:false,
        total: 0,
        list: [],
        listLoading: false,
        listQuery: {
          sgin:5,
          key_word: '',
          page: 1,
          pageSize: 10
        },
        tableHeight:'100',
        timer:'',
        downLoadUrl:'',
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
      // this.getList();
      this.getListTimer();
    },
    beforeDestroy() {
      clearInterval(this.timer);
      this.timer = null;
    },
    methods: {
      // getUrl(){
      //   this.downLoadUrl= this.global.domainName + 'admin/Export/collectList?big_category='+this.listQuery.big_category+'&small_category='+this.listQuery.small_category+'&source='+this.listQuery.source
      //     +'&start_time='+this.listQuery.start_time + '&end_time='+this.listQuery.end_time + '&status='+this.listQuery.status + '&page='+this.listQuery.page + '&pageSize='+this.listQuery.pageSize;
      // },
      // async handleExport(){
      //   await this.getUrl();
      //   document.getElementById("fileDownload").click();
      // },
      handleExport(){
        this.$axios({
          headers: { token: store.getters.token },
          method: 'get',
          url: '/admin/Export/collectList', // 请求地址
          params:this.listQuery,
          responseType: 'blob' // 表明返回服务器返回的数据类型
        }).then(response => {

          const blob = new Blob([response.data]);
          let myDate = new Date();
          let timename = myDate.toLocaleDateString().split('/').join('-');
          const fileName = '待协办申请' + timename + '.xls';
          const linkNode = document.createElement('a');
          linkNode.download = fileName; //a标签的download属性规定下载文件的名称
          linkNode.style.display = 'none';
          linkNode.href = URL.createObjectURL(blob); //生成一个Blob URL
          document.body.appendChild(linkNode);
          linkNode.click();  //模拟在按钮上的一次鼠标单击
          URL.revokeObjectURL(linkNode.href); // 释放URL 对象
          document.body.removeChild(linkNode);

        }).catch(
          function (error) {
            // 请求失败处理
            alert('请求失败！')
          })
      },
      getListTimer(){
        this.getList();
        this.timer = setInterval(()=> {
          this.getList();
        }, 10000);
      },
      formatSource(row, column, cellValue, index) {
        return cellValue == 1
          ? "问题登记"
          : cellValue == 2
            ? "AI识别"
            : cellValue == 3
              ? "车载视频"
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
      tableRowClassName({row, rowIndex}){
        if (row.type == 0) {
          return 'red01';
        }
        return '';
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
        clearInterval(this.timer);
        this.timer = null;
        this.showViewDialog = true;
        this.viewData = {
          id:row.id,
          order_no:row.order_no,
          option: {
            type:'view',
          }
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
