import request from '@/utils/request'
import Qs from 'qs'

/* 树形权限列表
 */
export function treeList(data) {
  return request({
    url: `/admin/menu/treeList`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}

/* 案件表达语列表
 * type type==allList 返回不分页列表
 * status  1、正常 2、禁用
 * page
 * pageSize
 */
export function languageList(data) {
  return request({
    url: `/admin/language/languageList`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}
/* 组织架构列表
 * department_name
 *
 */
export function departmentList(data) {
  return request({
    url: `/admin/department/list`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}
/* 组织架构列表
 * department_name
 *
 */
export function allDepartmentTreeList(data) {
  return request({
    url: `/admin/department/allDepartmentTreeList`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}

/* 类别列表
 * parent_id
 * type   =  allList 没有分页
 */
export function categoryList(data) {
  return request({
    url: `/admin/category/categoryList`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}

/* 获取部门的用户列表
 * department_id 部门id
 */
export function departmentUserList(data) {
  return request({
    url: `/admin/user/departmentUserList`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}

/* 获取分类详情
 * id
 */
export function categoryDetail(data) {
  return request({
    url: `/admin/category/detailCategory`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}
