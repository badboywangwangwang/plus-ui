import type { PayConfigForm, PayConfigQuery, PayConfigVO } from '@/api/pay/payConfig/types';
import type { PageResult } from '@/api/types';
import type { AxiosPromise } from '@/utils/api-types';
import request from '@/utils/request';

/**
 * 查询支付通道与商户配置列表
 * @param query
 * @returns {*}
 */
export const listPayConfig = (query?: PayConfigQuery): AxiosPromise<PageResult<PayConfigVO>> => {
  return request({
    url: '/pay/payConfig/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询支付通道与商户配置详细
 * @param configId
 */
export const getPayConfig = (configId: string | number): AxiosPromise<PayConfigVO> => {
  return request({
    url: '/pay/payConfig/' + configId,
    method: 'get'
  });
};

/**
 * 新增支付通道与商户配置
 * @param data
 */
export const addPayConfig = (data: PayConfigForm) => {
  return request({
    url: '/pay/payConfig',
    method: 'post',
    data: data
  });
};

/**
 * 修改支付通道与商户配置
 * @param data
 */
export const updatePayConfig = (data: PayConfigForm) => {
  return request({
    url: '/pay/payConfig',
    method: 'put',
    data: data
  });
};

/**
 * 修改支付通道与商户配置状态
 * @param configId
 * @param status
 */
export const changePayConfigStatus = (configId: string | number, status: string) => {
  return request({
    url: '/pay/payConfig/changeStatus',
    method: 'put',
    data: {
      configId,
      status: status
    }
  });
};


/**
 * 删除支付通道与商户配置
 * @param configId
 */
export const delPayConfig = (configId: string | number | Array<string | number>) => {
  return request({
    url: '/pay/payConfig/' + configId,
    method: 'delete'
  });
};
