import type { PayAppForm, PayAppQuery, PayAppVO } from '@/api/pay/payApp/types';
import type { PageResult } from '@/api/types';
import type { AxiosPromise } from '@/utils/api-types';
import request from '@/utils/request';

/**
 * 查询应用信息列表
 * @param query
 * @returns {*}
 */
export const listPayApp = (query?: PayAppQuery): AxiosPromise<PageResult<PayAppVO>> => {
  return request({
    url: '/pay/payApp/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询应用信息详细
 * @param appId
 */
export const getPayApp = (appId: string | number): AxiosPromise<PayAppVO> => {
  return request({
    url: '/pay/payApp/' + appId,
    method: 'get'
  });
};

/**
 * 新增应用信息
 * @param data
 */
export const addPayApp = (data: PayAppForm) => {
  return request({
    url: '/pay/payApp',
    method: 'post',
    data: data
  });
};

/**
 * 修改应用信息
 * @param data
 */
export const updatePayApp = (data: PayAppForm) => {
  return request({
    url: '/pay/payApp',
    method: 'put',
    data: data
  });
};

/**
 * 修改应用信息状态
 * @param appId
 * @param status
 */
export const changePayAppStatus = (appId: string | number, status: string) => {
  return request({
    url: '/pay/payApp/changeStatus',
    method: 'put',
    data: {
      appId,
      status: status
    }
  });
};


/**
 * 删除应用信息
 * @param appId
 */
export const delPayApp = (appId: string | number | Array<string | number>) => {
  return request({
    url: '/pay/payApp/' + appId,
    method: 'delete'
  });
};
