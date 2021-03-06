import { login, logout, getInfo } from '@/api/user'
import { treeList } from '@/api/system'
import { getToken, setToken, removeToken,getId,setId,removeId,getName,setName,removeName,getMobile,setMobile,removeMobile,setCity,removeCity,setCitySelected,removeCitySelected,getCollectNum,setCollectNum,removeCollectNum} from '@/utils/auth'
import router, { resetRouter } from '@/router'

import store from '@/store'
import axios from 'axios'
import {getCountCase} from "@/api/collect";

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  id:undefined,
  admin_mobile:'',
  collectNum:{},
  // citySelected:'',
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_MOBILE: (state, admin_mobile) => {
    state.admin_mobile = admin_mobile
  },
  SET_COLLECTNUM: (state, collectNum) => {
    state.collectNum = collectNum
  },
  // SET_CITYSELECTED: (state, citySelected) => {
  //   state.citySelected = citySelected
  // },
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { mobile, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ mobile: mobile.trim(), password: password }).then(response => {
        const { data } = response;
        // token_type  access_token
        console.log('获取')
        console.log(data)
        commit('SET_TOKEN', data.token);



        // commit('SET_ID', response.data.id);
        // console.log(response.data.city_list);
        // commit('SET_CITY', response.data.city_list);
        // commit('SET_CITYSELECTED', response.data.city_list[0].id);
        //
        // setCity(response.data.city_list);
        // setCitySelected(response.data.city_list[0].id);
        // setId(response.data.id);
        // setName(response.data.name);
        setToken(data.token);
        sessionStorage.setItem("Admin-Token", JSON.stringify(data.token));
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // let role = ['admin']
      // commit('SET_ROLES', role);
      // resolve(role);
      getInfo().then(res => {
        commit('SET_NAME', res.data.user_name);
        setName(res.data.name);
      })

      getCountCase().then(res => {
        if(res.code == 1){
          const {check,dispatch,end,deal,assist} = res.data;
          commit('SET_COLLECTNUM', {register:0,case:0,check,dispatch,end,deal,assist});
          setCollectNum({register:0,case:0,check,dispatch,end,deal,assist});
        }else{
          commit('SET_COLLECTNUM', {register:0,case:0,check:0,dispatch:0,end:0,deal:0,assist:0});
          setCollectNum({register:0,case:0,check:0,dispatch:0,end:0,deal:0,assist:0});
        }
      }).catch(error => {
        commit('SET_COLLECTNUM', {register:0,case:0,check:0,dispatch:0,end:0,deal:0,assist:0});
        setCollectNum({register:0,case:0,check:0,dispatch:0,end:0,deal:0,assist:0});
      });

      treeList({app_type: 1}).then(response => {
        if(response.code == 1){
          // function getTreeData (data) {
          //   if (data != "" || data != null) {
          //     for (let i = 0; i < data.length; i++) {
          //       if (data[i].child.length < 1) {
          //         // children若为空数组，则将children设为undefined
          //         // if (data[i].grade == 3) {
          //         //   data[i].childrens = undefined;
          //         // }
          //         data[i].child = undefined;
          //       } else {
          //         // children若不为空数组，则继续 递归调用 本方法
          //         this.getTreeData(data[i].child);
          //       }
          //     }
          //     return data;
          //   }
          // }
          let roleArr = [];
          // roleArr = response.data;
          function getTreeData (data) {
            if (data != "" || data != null) {
              for (let i = 0; i < data.length; i++) {
                if(data[i].child){
                  if (data[i].child.length < 1) {
                    // children若为空数组，则将children设为undefined
                    // if (data[i].grade == 3) {
                    //   data[i].childrens = undefined;
                    // }
                    data[i].child = undefined;
                  } else {
                    // children若不为空数组，则继续 递归调用 本方法
                    getTreeData(data[i].child);
                    roleArr = roleArr.concat(data[i].child)
                  }
                }
              }
              // return data;
            }
          }

          getTreeData(response.data);

          roleArr = roleArr.concat(response.data)
          roleArr = roleArr.map(item=>{return item.url_key})
          console.log('权限')
          console.log(roleArr)

          // commit('SET_ID', response.data.id);
          // commit('SET_NAME', response.data.nickname);
          commit('SET_MOBILE', response.data.mobile);
          // setId(response.data.id);
          // setName(response.data.nickname);
          setMobile(response.data.mobile)
          let role = roleArr
          // role = ['admin']
          // if(response.data.user_name == 'admin'){
          //   role = ['admin']
          // }else{
          //   if(response.data.permissions == null){
          //     role = ['index']
          //   }else{
          //     role = response.data.permissions
          //   }
          // }
          commit('SET_ROLES', role);
          resolve( role);
        }else{
          commit('SET_ID', '');
          commit('SET_TOKEN', '');
          commit('SET_ROLES', []);
          commit('SET_NAME', '');
          commit('SET_MOBILE', '');
          removeToken();
          resetRouter();
          // removeId();
          removeName();
          removeMobile();
        }
      }).catch(error => {
        console.log('权限获取失败')
        commit('SET_ID', '');
        commit('SET_TOKEN', '');
        commit('SET_ROLES', []);
        commit('SET_NAME', '');
        commit('SET_MOBILE', '');
        removeToken();
        sessionStorage.setItem("Admin-Token", '');
        resetRouter();
        // removeId();
        removeName();
        removeMobile();
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      // logout(state.token).then(() => {
      logout({access_token: getToken()}).then(() => {
        commit('SET_ID', '');
        commit('SET_TOKEN', '');
        commit('SET_ROLES', []);
        commit('SET_NAME', '');
        commit('SET_MOBILE', '');
        // commit('SET_CITY', []);
        // commit('SET_CITYSELECTED', '');
        // removeCitySelected();
        // removeCity();
        removeToken();
        sessionStorage.setItem("Admin-Token", '');
        resetRouter();
        // removeId();
        removeName();
        removeMobile();
        commit('SET_COLLECTNUM', {register:0,case:0,check:0,dispatch:0,end:0,deal:0,assist:0});
        setCollectNum({register:0,case:0,check:0,dispatch:0,end:0,deal:0,assist:0});
        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })
        resolve()
      }).catch(error => {
        commit('SET_ID', '');
        commit('SET_TOKEN', '');
        commit('SET_ROLES', []);
        commit('SET_NAME', '');
        commit('SET_MOBILE', '');
        // commit('SET_CITY', []);
        commit('SET_COLLECTNUM', {register:0,case:0,check:0,dispatch:0,end:0,deal:0,assist:0});
        setCollectNum({register:0,case:0,check:0,dispatch:0,end:0,deal:0,assist:0});
        removeToken();
        // removeCitySelected();
        // removeCity();
        sessionStorage.setItem("Admin-Token", '');
        resetRouter();
        // removeId();
        removeName();
        removeMobile();
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '');
      commit('SET_ROLES', []);
      // commit('SET_ID', '');
      commit('SET_NAME', '');
      // commit('SET_CITY', []);
      removeToken();
      // removeCity();
      // removeCitySelected();
      commit('SET_COLLECTNUM', {register:0,case:0,check:0,dispatch:0,end:0,deal:0,assist:0});
      setCollectNum({register:0,case:0,check:0,dispatch:0,end:0,deal:0,assist:0});
      sessionStorage.setItem("Admin-Token", '');
      // removeId();
      removeName();
      resolve()
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
