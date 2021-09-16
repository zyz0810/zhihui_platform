<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="50%"
    @close="close"
    top="15vh"
    :title="titleTxt"
    class="dialogContainer"
    :append-to-body="true"
    @open="open"
  >
    <el-form ref="dataForm" :rules="rules" :model="temp" label-width="120px" class="mt_20">
      <el-form-item label="说明" prop="name">
        <el-select v-model="temp.status">
          <el-option v-for="item in languageList" :label="item.language" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="showViewDialog = false">取 消</el-button>
      <el-button type="primary" @click="onSubmit(paraData.operatorType)" :loading="paraLoading">{{titleTxt}}(没接口)</el-button>
    </div>
  </myDialog>
</template>

<script>
  import {languageList,} from '@/api/system'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  export default {
    name: 'adoptView',
    directives: { waves },
    components: {
      draggable,
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
          operatorType: 1,
          id: ""
        }
      }
    },
    data() {
      return {
        paraLoading:false,
        titleTxt:'',
        languageList:[],
        temp: {
          id:'',
          parameterId:undefined,
          deleted:0
        },
        rules: {
          name: [{ required: true, message: '请输入说明', trigger: 'change' }],
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
        this.titleTxt = this.paraData.operatorType==1?'通过':'废弃'
        this.getLanguage();
      },
      close(){},
      getLanguage() {
        languageList({page:1,pageSize:99999}).then(res => {
          this.languageList = res.data.data
        });
      },
      onSubmit(type){},
    }
  }
</script>
