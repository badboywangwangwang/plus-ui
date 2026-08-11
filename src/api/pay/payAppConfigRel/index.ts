import type { PayAppConfigRelForm, PayAppConfigRelQuery, PayAppConfigRelVO } from '@/api/pay/payAppConfigRel/types';
import type { PageResult } from '@/api/types';
import type { AxiosPromise } from '@/utils/api-types';
import request from '@/utils/request';

/**
 * 查询程序与商户绑定表列表
 * @param query
 * @returns {*}
 */
export const listPayAppConfigRel = (query?: PayAppConfigRelQuery): AxiosPromise<PageResult<PayAppConfigRelVO>> => {
  return request({
    url: '/pay/payAppConfigRel/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询程序与商户绑定表详细
 * @param id
 */
export const getPayAppConfigRel = (id: string | number): AxiosPromise<PayAppConfigRelVO> => {
  return request({
    url: '/pay/payAppConfigRel/' + id,
    method: 'get'
  });
};

/**
 * 新增程序与商户绑定表
 * @param data
 */
export const addPayAppConfigRel = (data: PayAppConfigRelForm) => {
  return request({
    url: '/pay/payAppConfigRel',
    method: 'post',
    data: data
  });
};

/**
 * 修改程序与商户绑定表
 * @param data
 */
export const updatePayAppConfigRel = (data: PayAppConfigRelForm) => {
  return request({
    url: '/pay/payAppConfigRel',
    method: 'put',
    data: data
  });
};



/**
 * 删除程序与商户绑定表
 * @param id
 */
export const delPayAppConfigRel = (id: string | number | Array<string | number>) => {
  return request({
    url: '/pay/payAppConfigRel/' + id,
    method: 'delete'
  });
};
