import type { PayCityForm, PayCityQuery, PayCityVO } from '@/api/pay/payCity/types';
import type { PageResult } from '@/api/types';
import type { AxiosPromise } from '@/utils/api-types';
import request from '@/utils/request';

/**
 * 查询城市信息列表
 * @param query
 * @returns {*}
 */
export const listPayCity = (query?: PayCityQuery): AxiosPromise<PageResult<PayCityVO>> => {
  return request({
    url: '/pay/payCity/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询城市信息详细
 * @param cityId
 */
export const getPayCity = (cityId: string | number): AxiosPromise<PayCityVO> => {
  return request({
    url: '/pay/payCity/' + cityId,
    method: 'get'
  });
};

/**
 * 新增城市信息
 * @param data
 */
export const addPayCity = (data: PayCityForm) => {
  return request({
    url: '/pay/payCity',
    method: 'post',
    data: data
  });
};

/**
 * 修改城市信息
 * @param data
 */
export const updatePayCity = (data: PayCityForm) => {
  return request({
    url: '/pay/payCity',
    method: 'put',
    data: data
  });
};

/**
 * 修改城市信息状态
 * @param cityId
 * @param status
 */
export const changePayCityStatus = (cityId: string | number, status: string) => {
  return request({
    url: '/pay/payCity/changeStatus',
    method: 'put',
    data: {
      cityId,
      status: status
    }
  });
};


/**
 * 删除城市信息
 * @param cityId
 */
export const delPayCity = (cityId: string | number | Array<string | number>) => {
  return request({
    url: '/pay/payCity/' + cityId,
    method: 'delete'
  });
};
