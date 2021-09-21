import request from '@/utils/request'
import Qs from 'qs'
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

