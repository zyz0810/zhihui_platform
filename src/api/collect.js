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
/* 废弃 驳回 待审核 待处置 待结案 状态修改
 * id ID
 * status 只能是0、1、7、8  （1、待审核  2、待派遣 3、待协办申请  4、转办  5、待协办 6、协办 7、待处置  8、待结案  9、结案  0、废弃）
 * language_desc 描述
 * deal_images 处理后图片 多个用,拼接
 */
export function collectStatus(data) {
  return request({
    url:'/admin/collect/editCollect',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 案件转办
 * id ID
 * big_category 大类
 * small_category 小类
 * language_desc 	建议说明
 * depart_id 转办部门
 */
export function collectTurnDeal(data) {
  return request({
    url:'/admin/collect/turnDeal',
    method: 'post',
    data: Qs.stringify(data)
  })
}

/* 案件申请协办
 * id ID
 * big_category 大类
 * small_category 小类
 * language_desc 	建议说明
 */
export function collectApplyAssist(data) {
  return request({
    url:'/admin/collect/applyAssist',
    method: 'post',
    data: Qs.stringify(data)
  })
}

/* 协办案件
 * id ID
 * big_category 大类
 * small_category 小类
 * language_desc 	建议说明
 * assist_depart 	协办部门
 * time 时间 例如 14小时 4天 3天8小时 等
 */
export function collectAssist(data) {
  return request({
    url:'/admin/collect/assist',
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
