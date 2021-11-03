<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        background-color="#fff"
        text-color="#606266"
        :unique-opened="false"
        active-text-color="#fff"
        :collapse-transition="false"
        mode="vertical" class="bold">
<!--        <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />-->
        <sidebar-item v-for="route in permission_routes" :key="route.redirect" :item="route" :base-path="route.path" :collectNum="collectNum"/>
        <!--<sidebar-item v-for="route in $router.options.routes" :key="route.path" :item="route" :base-path="route.path" />-->
      </el-menu>

    </el-scrollbar>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Logo from './Logo'
  import SidebarItem from './SidebarItem'
  import variables from '@/styles/variables.scss'
  import {getCountCase} from '@/api/collect'
  export default {
    data() {
      return {
        collectNum:{
          register:0,
          case:0,
          check:0,
          dispatch:0,
          end:0,
          deal:0,
          assist:0
        },
        timerNum:''
      }
    },
    components: { SidebarItem, Logo },
    computed: {
      ...mapGetters([
        'permission_routes',
        'sidebar'
      ]),
      activeMenu() {

        const route = this.$route
        const { meta, path } = route
        // if set path, the sidebar will highlight the path you set
        if (meta.activeMenu) {
          return meta.activeMenu
        }
        return path
      },
      showLogo() {
        return this.$store.state.settings.sidebarLogo
      },
      variables() {
        return variables
      },
      isCollapse() {
        return !this.sidebar.opened
      }
    },
    mounted() {
      this.getNum();
      this.timerNum = setInterval(()=> {
        this.getNum();
      }, 60000);
    },
    beforeDestroy() {
      clearInterval(this.timerNum);
      this.timerNum = null;
    },
    methods:{
      getNum() {
        getCountCase().then(res => {
          if(res.code == 1){
            const {check,dispatch,end,deal,assist} = res.data;
            this.collectNum = {register:0,case:0,check,dispatch,end,deal,assist};
          }
        })
      },
    },
  }
</script>
