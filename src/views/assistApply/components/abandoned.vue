<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="50%"
    @close="close"
    top="10vh"
    title="驳回"
    class="dialogContainer"
    :append-to-body="true"
    @open="open"
  >
    <el-form ref="dataForm" :rules="rules" :inline="true" :model="temp" label-width="120px" class="mt_20">
      <el-form-item label="说明" prop="language_desc">
        <el-select v-model="temp.language_desc" filterable allow-create>
          <el-option v-for="item in languageList" :label="item.language" :value="item.language"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="showViewDialog = false">取 消</el-button>
      <el-button type="primary" @click="onSubmit()" :loading="paraLoading">废 弃</el-button>
    </div>
  </myDialog>
</template>

<script>
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import Pagination from "@/components/Pagination/index"; // waves directive
  import SingleImage from "@/components/Upload/SingleImage.vue";
  import {languageList} from "@/api/system";
  import {collectStatus} from "@/api/collect"; // waves directive
  export default {
    name: 'abandonedView',
    directives: { waves },
    components: {
      draggable,
      Pagination,
      SingleImage
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
        languageList:[],
        paraLoading:false,
        temp: {
          language_desc:'',
          id:'',
          status:2
        },
        rules: {
          language_desc: [{ required: true, message: '请输入说明', trigger: 'change' }],
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

    methods: {
      open(){
        this.temp.id = this.paraData.id;
        this.getLanguage();
      },
      close(){},
      getLanguage() {
        languageList({page:1,pageSize:99999}).then(res => {
          this.languageList = res.data.data
        });
      },
      onSubmit(){
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.paraLoading = true;
            collectStatus(this.temp).then((res) => {
              setTimeout(() => {
                this.paraLoading = false
              }, 1000)
              if (res.code == 1) {
                this.$emit('updateView');
                this.showViewDialog = false;
                this.$message({
                  message: res.message,
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
