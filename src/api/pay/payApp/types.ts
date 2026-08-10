export interface PayAppVO {
  /**
   * 应用主键
   */
  appId: string | number;
  /**
   * 归属法人
   */
  merchantId: string | number;
  /**
   * 应用名称
   */
  appName: string;
  /**
   * 应用类型
   */
  appType: string;
  /**
   * 应用标识
   */
  appIdentity: string | number;
  /**
   * 应用密钥
   */
  appSecret: string;
  /**
   * 客服类型
   */
  customServiceType: string;
  /**
   * 客服会话
   */
  sessionId: string | number;
  /**
   * 注册邮箱
   */
  accountEmail: string;
  /**
   * 状态（0正常 1停用）
   */
  status: string;
  /**
   * 备注
   */
  remark: string;
}

export interface PayAppForm extends BaseEntity {
  /**
   * 应用主键
   */
  appId?: string | number;
  /**
   * 归属法人
   */
  merchantId?: string | number;
  /**
   * 应用名称
   */
  appName?: string;
  /**
   * 应用类型
   */
  appType?: string;
  /**
   * 应用标识
   */
  appIdentity?: string | number;
  /**
   * 应用密钥
   */
  appSecret?: string;
  /**
   * 客服类型
   */
  customServiceType?: string;
  /**
   * 客服会话
   */
  sessionId?: string | number;
  /**
   * 注册邮箱
   */
  accountEmail?: string;
  /**
   * 状态（0正常 1停用）
   */
  status?: string;
  /**
   * 备注
   */
  remark?: string;
}

export interface PayAppQuery extends PageQuery {
  /**
   * 归属法人
   */
  merchantId?: string | number;
  /**
   * 应用名称
   */
  appName?: string;
  /**
   * 应用类型
   */
  appType?: string;
  /**
   * 客服类型
   */
  customServiceType?: string;
  /**
   * 状态（0正常 1停用）
   */
  status?: string;
  /**
   * 日期范围参数
   */
  params?: any;
}
