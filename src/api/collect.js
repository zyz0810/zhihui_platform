import request from '@/utils/request'
import Qs from 'qs'
/* 部门
 */
export function departTree(data) {
  return request({
    url:'/admin/Department/departTree',
    method: 'post',
    data: Qs.stringify(data)
  })
}

/* 案件列表
 * pageSize 分页结束位置
 * page  分页起始位置
 * status  1、待审核  2、待派遣 3、待协办 4、待处置  5、待结案  6、结案
 */
export function collectList(data) {
  return request({
    url:'/admin/collect/collectList',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 案件详情
 * id
 */
export function collectView(data) {
  return request({
    url:'/admin/collect/detailCollect',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 添加案件
 */
export function collectAdd(data) {
  return request({
    url:'/admin/collect/addCollect',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 编辑案件
 */
export function collectEdit(data) {
  return request({
    url:'/admin/collect/editCollect',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 待协办申请列表
 */
export function sendCollectList(data) {
  return request({
    url:'/admin/collect/sendCollectList',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 获取案件所有步骤
 * order_no  案件编号
 */
export function stepLog(data) {
  return request({
    url:'/admin/collect/stepLog',
    method: 'post',
    data: Qs.stringify(data)
  })
}
