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
    <el-descriptions class="margin-top" title="" :column="2" size="medium" border>
      <el-descriptions-item>
        <template slot="label">任务号</template>
        2021206852510332
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">上报时间</template>
        2021-06-22 10:31:23
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">事件大类</template>
        容貌
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">事件小类</template>
       公共设施倾斜
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">事件状态</template>
        待审核
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">是否紧急事件</template>
        否
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">事件来源</template>
        采集员采集
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">采集员</template>
        采集员1
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">采集员手机号</template>
        18963245623
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">所属部门</template>
        采集公司
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">位置</template>
        湖州市德清县5525号
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">问题描述</template>
        湖州市德清县隔离墩倾斜
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">问题图片</template>
        湖州市德清县隔离墩倾斜
      </el-descriptions-item>
    </el-descriptions>
    <div slot="footer" class="dialog-footer">
      <el-button @click="showViewDialog = false">取 消</el-button>
      <el-button type="warning" @click="showAbandonedDialog = true" :loading="paraLoading">废 弃</el-button>
      <el-button type="primary" @click="showAdoptDialog = true" :loading="paraLoading">通 过</el-button>
    </div>
    <adoptView :showDialog.sync="showAdoptDialog" :paraData="paraData"></adoptView>
    <abandonedView :showDialog.sync="showAbandonedDialog" :paraData="paraData"></abandonedView>
  </myDialog>
</template>

<script>
  import map from '@/components/Map/map' // 引入刚才的map.js 注意路径
  import {paraValueList,paraValueSave,paraValueUpdate,paraValueDelete} from '@/api/parameter'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import Pagination from "@/components/Pagination/index"; // waves directive
  import SingleImage from "@/components/Upload/SingleImage.vue"; // waves directive
  import adoptView from "./adopt"; // waves directive
  import abandonedView from "./abandoned"; // waves directive
  export default {
    name: 'parameterView',
    directives: { waves },
    components: {
      draggable,
      Pagination,
      SingleImage,
      adoptView,
      abandonedView
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
        showAdoptDialog:false,
        showAbandonedDialog:false,
        map: '', // 对象
        zoom: 12, // 地图的初始化级别，及放大比例
        centerLatitude:'30.20835',//中心纬度
        centerLongitude:'120.21194',//中心经度
        paraLoading:false,
        temp: {
          name:'',
          parameterId:undefined,
          deleted:0
        },
        rules: {
          name: [{ required: true, message: '请输入名称', trigger: 'change' }],
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
        let StatusArr = {0:'禁用', 1:'启用'}
        return StatusArr[value]
      }
    },
    methods: {
      onLoad() {
        let T = window.T;
        let map = new T.Map('mapDiv');
        map.centerAndZoom(new T.LngLat(this.centerLongitude, this.centerLatitude), this.zoom); // 设置显示地图的中心点和级别
        // 普通标注
        document.getElementsByClassName("tdt-control-copyright tdt-control")[0].style.display = 'none';
        //创建标注工具对象
        let markerTool = new T.MarkTool(map, {follow: true});

        function endeditMarker() {
          let markers = markerTool.getMarkers();
          for (let i = 0; i < markers.length; i++) {
            markers[i].disableDragging();
          }
        }
        var cp = new T.CoordinatePickup(map, {callback: this.getLngLat})
        cp.addEvent();
        function editMarker() {
          let markers = markerTool.getMarkers()
          console.log(markers)
          for (let i = 0; i < markers.length; i++) {
            markers[i].enableDragging();
          }

        }
        // endeditMarker();
        editMarker();
        markerTool.open();

      },
      getLngLat(lnglat) {
        this.temp.address  = lnglat.lng.toFixed(6) + "," + lnglat.lat.toFixed(6);
        this.temp.log = lnglat.lng.toFixed(6)
        this.temp.lat = lnglat.lat.toFixed(6)
      },
      hasImgSrc(val) {
        this.temp.imgUrl = val;
      },
      open(){
        this.$nextTick(function() {
          this.onLoad();
        })
      },
      close(){},
      resetTemp() {
        this.temp = {
          // parameterId:undefined,
          name:'',
          parameterId:undefined,
          deleted:0
          // orders:'',
          // isSystem:1,
        }
      },



      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.paraLoading = true
            this.temp.parameterId = this.paraData.id
            paraValueSave(this.temp).then((res) => {
              setTimeout(()=>{
                this.paraLoading = false
              },1000)
              if(res.resp_code == 0) {
                this.getList();
                // this.list.unshift(res.data);
               this.showViewDialog = false;
                // debugger
                this.getList();
                this.$message({
                  message: '增加成功',
                  type: 'success'
                });
              }
            }).catch(() => {
              this.paraLoading = false;
            });
          }
        })
      },


    }
  }
</script>
