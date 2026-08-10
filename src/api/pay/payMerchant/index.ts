import type { PayMerchantForm, PayMerchantQuery, PayMerchantVO } from '@/api/pay/payMerchant/types';
import type { PageResult } from '@/api/types';
import type { AxiosPromise } from '@/utils/api-types';
import request from '@/utils/request';

/**
 * 查询法人信息列表
 * @param query
 * @returns {*}
 */
export const listPayMerchant = (query?: PayMerchantQuery): AxiosPromise<PageResult<PayMerchantVO>> => {
  return request({
    url: '/pay/payMerchant/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询法人信息详细
 * @param merchantId
 */
export const getPayMerchant = (merchantId: string | number): AxiosPromise<PayMerchantVO> => {
  return request({
    url: '/pay/payMerchant/' + merchantId,
    method: 'get'
  });
};

/**
 * 新增法人信息
 * @param data
 */
export const addPayMerchant = (data: PayMerchantForm) => {
  return request({
    url: '/pay/payMerchant',
    method: 'post',
    data: data
  });
};

/**
 * 修改法人信息
 * @param data
 */
export const updatePayMerchant = (data: PayMerchantForm) => {
  return request({
    url: '/pay/payMerchant',
    method: 'put',
    data: data
  });
};

/**
 * 修改法人信息状态
 * @param merchantId
 * @param status
 */
export const changePayMerchantStatus = (merchantId: string | number, status: string) => {
  return request({
    url: '/pay/payMerchant/changeStatus',
    method: 'put',
    data: {
      merchantId,
      status: status
    }
  });
};


/**
 * 删除法人信息
 * @param merchantId
 */
export const delPayMerchant = (merchantId: string | number | Array<string | number>) => {
  return request({
    url: '/pay/payMerchant/' + merchantId,
    method: 'delete'
  });
};
