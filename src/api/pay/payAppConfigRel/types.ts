export interface PayAppConfigRelVO {
  /**
   * 主键ID
   */
  id: string | number;
  /**
   * 应用/小程序ID（关联 gan_pay_app.app_id）
   */
  appId: string | number;
  /**
   * 支付商户配置ID（关联 gan_pay_config.config_id）
   */
  configId: string | number;
  /**
   * 在此应用下是否为默认通道（0否 1是）
   */
  isDefault: boolean;
}

export interface PayAppConfigRelForm extends BaseEntity {
  /**
   * 主键ID
   */
  id?: string | number;
  /**
   * 应用/小程序ID（关联 gan_pay_app.app_id）
   */
  appId?: string | number;
  /**
   * 支付商户配置ID（关联 gan_pay_config.config_id）
   */
  configId?: string | number;
  /**
   * 在此应用下是否为默认通道（0否 1是）
   */
  isDefault?: boolean;
  /**
   * 创建部门
   */
  createDept?: number;
  /**
   * 绑定操作人
   */
  createBy?: string;
  /**
   * 绑定时间
   */
  createTime?: string;
  /**
   * 更新者
   */
  updateBy?: string;
  /**
   * 更新时间
   */
  updateTime?: string;
}

export interface PayAppConfigRelQuery extends PageQuery {
  /**
   * 应用/小程序ID（关联 gan_pay_app.app_id）
   */
  appId?: string | number;
  /**
   * 支付商户配置ID（关联 gan_pay_config.config_id）
   */
  configId?: string | number;
  /**
   * 在此应用下是否为默认通道（0否 1是）
   */
  isDefault?: boolean;
  /**
   * 创建部门
   */
  createDept?: number;
  /**
   * 绑定操作人
   */
  createBy?: string;
  /**
   * 绑定时间
   */
  createTime?: string;
  /**
   * 更新者
   */
  updateBy?: string;
  /**
   * 更新时间
   */
  updateTime?: string;
  /**
   * 日期范围参数
   */
  params?: any;
}
