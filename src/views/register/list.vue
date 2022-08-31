<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="search_form">
        <el-form-item label="案件来源">
          <el-select v-model="listQuery.source" placeholder="选择巡查来源" clearable>
            <el-option label="问题登记" value="1"></el-option>
            <el-option label="AI识别" value="2"></el-option>
            <el-option label="车载视频" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="案件小类">
          <el-cascader ref="cascaderPublish" clearable v-model="listQuery.small_category" :options="categoryList" @change="changeCategory" :show-all-levels="false" filterable :props="props" placeholder="请选择违规类型"></el-cascader>
        </el-form-item>
        <el-form-item label="时间：" prop="name">
          <el-date-picker
            v-model="dateTime"
            value-format="yyyy-MM-dd"
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
        <el-button type="primary" icon="iconfont icon-daochu1" v-if="roles.includes('admin-centre-register-problem') || roles.includes('two-depart-register-problem') ||
 roles.includes('centre-register-problem') || roles.includes('depart-register-problem')" @click="handleView">问题登记</el-button>
        <el-button type="primary" icon="iconfont icon-daochu1" @click="handleExport">导出</el-button>
      </div>
      <el-table v-loading="listLoading" :data="list" :height="tableHeight" border :header-cell-style="{background:'rgb(163,192,237)',}"
                element-loading-text="拼命加载中" fit ref="tableList">
        <el-table-column label="序号" width="80" align="center">
          <template slot-scope="scope">
            {{(listQuery.page - 1) * listQuery.pageSize + scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column label="任务号" align="center" prop="number_no"></el-table-column>
        <el-table-column label="案件大类" align="center" prop="big_category_name" show-overflow-tooltip></el-table-column>
        <el-table-column label="案件小类" align="center" prop="small_category_name" show-overflow-tooltip></el-table-column>
        <el-table-column label="上报人" align="center" prop="report"></el-table-column>
        <el-table-column label="上报人电话" align="center" prop="mobile"></el-table-column>
        <el-table-column label="是否紧急事件" align="center" prop="is_importance" :formatter="formatImportant"></el-table-column>
        <el-table-column label="登记时间" align="center" prop="create_at" :formatter="formatTime"></el-table-column>
        <el-table-column label="事件位置" align="center" prop="address" show-overflow-tooltip></el-table-column>
        <el-table-column label="问题描述" align="center" prop="description" show-overflow-tooltip></el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize"
                  @pagination="getList" class="text-right"/>
    </div>

    <paraView :showDialog.sync="showViewDialog" :paraData="paraData" @insetList="getListTimer"></paraView>
    <a v-show="false" :href="downLoadUrl" id="fileDownload"></a>
  </div>
</template>

<script>
  import {collectList} from '@/api/collect'
  import {categoryList} from '@/api/system'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import { mapState } from 'vuex'
  import Pagination from "@/components/Pagination/index"; // waves directive
  import paraView from "./components/view";
  import store from "@/store";
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
        props: {
          expandTrigger: "click",
          value: "id",
          label: "name",
          children: "parent_list",
          disabled: false,
        },
        showViewDialog:false,
        paraData:{
          id:''
        },
        total: 0,
        list: [],
        listLoading: false,
        categoryList:[],
        listQuery: {
          big_category:'',
          small_category:'',
          source:'',
          start_time:'',
          end_time:'',
          status:1,
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
      dateTime: {
        get () {
          if (this.listQuery.start_time && this.listQuery.end_time) {
            return [this.listQuery.start_time, this.listQuery.end_time];
          } else {
            return [];
          }
        },
        set (v) {
          if (v) {
            this.listQuery.start_time = v[0];
            this.listQuery.end_time = v[1];
          } else {
            this.listQuery.start_time = "";
            this.listQuery.end_time = "";
          }
        },
      },
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
            self.tableHeight =300
          }
        };
      });
      // this.getList();
      this.getListTimer();
      this.getCategory();
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
          const fileName = '问题登记' + timename + '.xls';
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
      changeCategory(val){
        this.listQuery.big_category = val[0];
        this.listQuery.small_category = val[1];
      },
      getCategory() {
        // departTree().then(res => {
        //   this.categoryList = this.getTreeData(res.data);
        // });
        categoryList({page:1,pageSize:99999}).then(res=>{
          this.categoryList = res.data.data

        });
      },
      getTreeData (data) {
        if (data != "" || data != null) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].child.length < 1) {
              // children若为空数组，则将children设为undefined
              // if (data[i].grade == 3) {
              //   data[i].childrens = undefined;
              // }
              data[i].child = undefined;
            } else {
              // children若不为空数组，则继续 递归调用 本方法
              this.getTreeData(data[i].child);
            }
          }
          return data;
        }
      },
      formatImportant(row, column, cellValue, index) {
        return cellValue == 1
          ? "是"
          : cellValue == 2
            ? "否"
            : "--";
      },
      formatTime(row, column, cellValue, index) {
        return cellValue
          ? this.$moment(Number(cellValue)*1000).format("YYYY-MM-DD HH:mm:ss")
          : "暂无";
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

      handleView(row){
        this.showViewDialog = true;
        this.paraData = {
          // id:row.id
        };
        clearInterval(this.timer);
        this.timer = null;
      },

    }
  }
</script>
