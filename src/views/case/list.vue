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
                element-loading-text="拼命加载中" fit ref="tableList" @row-click="handleView">
        <el-table-column label="序号" width="80" align="center">
          <template slot-scope="scope">
            {{(listQuery.page - 1) * listQuery.pageSize + scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column label="案件编号" align="center" prop="number_no"></el-table-column>
        <el-table-column label="任务号" align="center" prop="number_no"></el-table-column>
        <el-table-column label="大类" align="center" prop="big_category_name" show-overflow-tooltip></el-table-column>
        <el-table-column label="小类" align="center" prop="small_category_name" show-overflow-tooltip></el-table-column>
        <el-table-column label="上报时间" align="center" prop="create_at" :formatter="formatTime"></el-table-column>
        <!--<el-table-column label="剩余时间" align="center" prop="residue_time"></el-table-column>-->
        <el-table-column label="紧急案件" align="center" prop="is_importance" :formatter="formatImportant"></el-table-column>
        <el-table-column label="问题描述" align="center" prop="description" show-overflow-tooltip></el-table-column>
        <el-table-column label="状态" align="center" prop="sgin_name"></el-table-column>
        <el-table-column label="事件位置" align="center" prop="address" show-overflow-tooltip></el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize"
                  @pagination="getList" class="text-right"/>
    </div>

<!--    根据不同状态显示不同详情页-->
<!--    待审核状态-->
    <examineView :showDialog.sync="showExamineDialog" :paraData="viewData" @updateList="getListTimer"></examineView>
    <!--    待派遣状态-->
    <dispatchView :showDialog.sync="showDispatchDialog" :paraData="viewData" @updateList="getListTimer"></dispatchView>
    <!--    待协办-->
    <assistView :showDialog.sync="showAssistDialog" :paraData="viewData" @updateList="getListTimer"></assistView>
    <!--    待结案-->
    <endView :showDialog.sync="showEndDialog" :paraData="viewData" @updateList="getListTimer"></endView>
    <!--    待处置-->
    <disposalView :showDialog.sync="showDisposalDialog" :paraData="viewData" @updateList="getListTimer"></disposalView>
    <!--    待协办申请-->
    <assistApplyView :showDialog.sync="showAssistApplyDialog" :paraData="viewData" @updateList="getListTimer"></assistApplyView>
<!--    assistList-->
    <a v-show="false" :href="downLoadUrl" id="fileDownload"></a>
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
  import store from "@/store";
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
          id:'',
          order_no:'',
          option: {
            type:'caseView',
            big_category_name:'',
            small_category_name:'',
          },
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
      formatTime(row, column, cellValue, index) {
        return cellValue
          ? this.$moment(Number(cellValue)*1000).format("YYYY-MM-DD HH:mm:ss")
          : "暂无";
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
                      ? "已结案"
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
        // let StatusArr = { 1:'待审核',2:'待派遣', 3:'待处置',4:'待协办申请', 5:'待结案',6:'结案', 7:'废弃',};
        // this.showViewDialog = true
        if(row.sgin_name == '待审核'){
          clearInterval(this.timer);
          this.timer = null;
          this.showExamineDialog = true;
        }else if(row.sgin_name == '待派遣'){
          clearInterval(this.timer);
          this.timer = null;
          this.showDispatchDialog = true;
        }else if(row.sgin_name == '待处置'){
          clearInterval(this.timer);
          this.timer = null;
          this.showDisposalDialog = true;
        }else if(row.sgin_name == '待协办申请'){
          clearInterval(this.timer);
          this.timer = null;
          this.showAssistApplyDialog = true;
        }else if(row.sgin_name == '待结案'){
          clearInterval(this.timer);
          this.timer = null;
          this.showEndDialog = true;
        }else if(row.sgin_name == '已结案'){
          clearInterval(this.timer);
          this.timer = null;
          this.showEndDialog = true;
        }else if(row.sgin_name == '废弃'){
          clearInterval(this.timer);
          this.timer = null;
          this.showExamineDialog = true;
        }

        this.viewData = {
          id:row.id,
          order_no:row.order_no,
          option: {
            type:'caseView',
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
