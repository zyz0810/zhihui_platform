<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 v-else class="sidebar-title">{{ title }}111 </h1>
      </router-link>

      <!--<router-link v-else key="expand" class="sidebar-logo-link" to="/">-->
        <!--<img v-if="logo" :src="logo" class="sidebar-logo block">-->
        <!--<p class="sidebar-title"><span class="f18">{{title}}</span></p>-->
      <!--</router-link>-->
      <div v-else  class="sidebar-logo-link">
        <img v-if="logo" :src="logo" class="sidebar-logo block">
        <p class="sidebar-title f16">指挥平台</p>
      </div>
    </transition>
  </div>
</template>

<script>
  import logo from '@/assets/image/logo_img.png'
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      logo: logo
    }
  },
  watch: {

  },
  methods:{

  },
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 200px;
  line-height: 50px;
  background: url("./../../../assets/image/logo_bg.png")  left bottom no-repeat;
  background-size: 100% auto;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 155px;
    width: 100%;
    padding-top: 20px;
    background: #3258a6;
    & .sidebar-logo {
      width: 66px;
      height: 66px;
      vertical-align: middle;
      margin: 0 auto;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      /*font-weight: 600;*/
      line-height: 50px;
      /*font-size: 14px;*/
      letter-spacing: 3px;
      /*font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;*/
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
