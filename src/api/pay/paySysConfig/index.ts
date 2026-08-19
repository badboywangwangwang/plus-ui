import type { PaySysConfigForm, PaySysConfigQuery, PaySysConfigVO } from '@/api/pay/paySysConfig/types';
import type { PageResult } from '@/api/types';
import type { AxiosPromise } from '@/utils/api-types';
import request from '@/utils/request';

/**
 * 查询系统配置列表
 * @param query
 * @returns {*}
 */
export const listPaySysConfig = (query?: PaySysConfigQuery): AxiosPromise<PageResult<PaySysConfigVO>> => {
  return request({
    url: '/pay/paySysConfig/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询系统配置详细
 * @param id
 */
export const getPaySysConfig = (id: string | number): AxiosPromise<PaySysConfigVO> => {
  return request({
    url: '/pay/paySysConfig/' + id,
    method: 'get'
  });
};

/**
 * 新增系统配置
 * @param data
 */
export const addPaySysConfig = (data: PaySysConfigForm) => {
  return request({
    url: '/pay/paySysConfig',
    method: 'post',
    data: data
  });
};

/**
 * 修改系统配置
 * @param data
 */
export const updatePaySysConfig = (data: PaySysConfigForm) => {
  return request({
    url: '/pay/paySysConfig',
    method: 'put',
    data: data
  });
};



/**
 * 删除系统配置
 * @param id
 */
export const delPaySysConfig = (id: string | number | Array<string | number>) => {
  return request({
    url: '/pay/paySysConfig/' + id,
    method: 'delete'
  });
};
