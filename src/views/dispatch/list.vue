<template>
  <div class="app-container">
    <div class="wrap">
      <!--<audio id="audioMusic" class="audio" src="http://file.sucaibar.com/file/yinxiao/yinxiao-104.mp3" controls autoplay="autoplay" hidden="true" ref="audio"></audio>-->
      <audio id="audioMusic" class="audio" src="./../../assets/image/dingdong.mp3" controls hidden="true" ref="audio"></audio>
    </div>
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
        <el-table-column label="案件编号" align="center" prop="number_no"></el-table-column>
        <el-table-column label="事件来源" align="center" prop="source" :formatter="formatSource"></el-table-column>
        <el-table-column label="大类" align="center" prop="big_category_name" show-overflow-tooltip></el-table-column>
        <el-table-column label="小类" align="center" prop="small_category_name" show-overflow-tooltip></el-table-column>
        <el-table-column label="是否紧急事件" align="center" prop="is_importance" :formatter="formatImportant"></el-table-column>
        <el-table-column label="审核时间" align="center" prop="check_time" :formatter="formatTime"></el-table-column>
        <el-table-column label="事件位置" align="center" prop="address" show-overflow-tooltip></el-table-column>
        <el-table-column label="问题描述" align="center" prop="description" show-overflow-tooltip></el-table-column>
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
  import {collectList,getLastMessages,checkMessagesStatus} from "@/api/collect";
  export default {
    name: 'dispatchList',
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
        total: 0,
        list: [],
        listLoading: false,
        listQuery: {
          sgin:2,
          key_word: '',
          page: 1,
          pageSize: 10
        },
        tableHeight:'100',
        isPlay:false,
        timer:'',
        notifyPromise: Promise.resolve(),
        notifyListTwo: [],
      }
    },
    computed: {
      ...mapState({
        roles: state => state.user.roles,
      }),
    },
    mounted() {
      window.handleClose = this.handleClose;
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
      this.getLastMessagesList()
    },
    beforeDestroy() {
      clearInterval(this.timer);
      this.timer = null;
    },
    methods: {
      getLastMessagesList(){
        this.timer = setInterval(()=> {
          // $(".el-notification").remove();
          this.notifyListTwo = [];
          getLastMessages().then(res => {
            if(res.data != null && res.data.length > 0){
              let notifyList = res.data;
              this.isPlay = true;
              if (this.isPlay){
                document.getElementById('audioMusic').play();
              }
              for(let i=0;i< notifyList.length;i++){
                let a;
                this.notifyPromise = this.notifyPromise.then(() => {
                  let id =  notifyList[i].id;
                  let that  = this;
                  a = this.$notify({
                    title: notifyList[i].name,
                    dangerouslyUseHTMLString: true,
                    message: notifyList[i].message,
                    position: 'bottom-right',
                    duration: 9000,
                    showClose:false,
                    // type:notifyList[i].id,
                    onClick(){
                      console.log('点击关机按钮'+id)
                      console.log(id)
                      that.notifyListTwo[i].close()
                      checkMessagesStatus({id:id}).then(ress => {
                        // this.notifyListTwo[i].close()
                      })
                    },
                  })
                  this.notifyListTwo.push(a)
                })
              }
              this.isPlay = false;
            }else{
              this.notifyListTwo = [];
              // let notifyList = [{id:1,message:'11'},{id:2,message:'22'}];
              // this.isPlay = true;
              // if (this.isPlay){
              //   document.getElementById('audioMusic').play();
              // }
              // for(let i=0;i< notifyList.length;i++){
              //   let a;
              //   this.notifyPromise = this.notifyPromise.then(() => {
              //     let id =  notifyList[i].id;
              //     let that  = this;
              //     a = this.$notify({
              //       title: notifyList[i].name,
              //       dangerouslyUseHTMLString: true,
              //       message: notifyList[i].message,
              //       position: 'bottom-right',
              //       duration: 10000,
              //       showClose:false,
              //       // type:notifyList[i].id,
              //       onClick(){
              //         console.log('点击关机按钮'+id)
              //         console.log(id)
              //         that.notifyListTwo[i].close()
              //         checkMessagesStatus({id:id}).then(ress => {
              //           // this.notifyListTwo[i].close()
              //         })
              //       },
              //     })
              //     this.notifyListTwo.push(a)
              //   })
              // }
              this.isPlay = false;
            }
          });
        }, 10000);
      },
      handleClose(i){
        console.log(this.notifyListTwo)
        console.log('关系')
        this.notifyListTwo[i].close()
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
      handleView(row, column, event){
        this.showViewDialog = true
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
