export interface PayCityVO {

  /**
   * 应用主键
   */
  cityId: string | number;
  /**
   * 城市名称
   */
  cityName: string;
  /**
   * 状态（0正常 1停用）
   */
  status: string;
}

export interface PayCityForm extends BaseEntity {

  /**
   * 配置主键ID
   */
  cityId?: string | number;
  /**
   * 城市名称
   */
  cityName?: string;
  /**
   * 城市编码
   */
  cityCode?: string;
  /**
   * 状态（0正常 1停用）
   */
  status?: string;
}

export interface PayCityQuery extends PageQuery {
  /**
   * 城市名称
   */
  cityName?: string;
  /**
   * 状态（0正常 1停用）
   */
  status?: string;
  /**
   * 日期范围参数
   */
  params?: any;
}
