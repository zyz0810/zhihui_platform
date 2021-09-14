import request from '@/utils/request'
import Qs from 'qs'
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
