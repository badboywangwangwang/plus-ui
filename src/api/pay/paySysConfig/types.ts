export interface PaySysConfigVO {
  /**
   * 主键ID (固定为1，全局唯一配置)
   */
  id: string | number;
  /**
   * 客服电话
   */
  customerServicePhone: string;
  /**
   * 是否显示小程序退款 (1:显示 0:隐藏)
   */
  showMiniappRefund: number;
  /**
   * 是否显示手机号 (1:显示 0:隐藏)
   */
  showPhone: number;
  /**
   * 是否显示身份证 (1:显示 0:隐藏)
   */
  showIdCard: string | number;
  /**
   * 退款密码
   */
  refundPassword: string;
  /**
   * 小程序会话
   */
  miniappAesKey: string;
  /**
   * 小程序密钥
   */
  miniappSecret: string;
  /**
   * 查询企业的密钥
   */
  enterpriseQueryKey: string;
  /**
   * 查询的最大次数
   */
  maxQueryLimit: number;
  /**
   * 服务协议
   */
  serviceAgreement: string;
  /**
   * 注册协议
   */
  registrationAgreement: string;
  /**
   * 首页轮播图 (JSON格式存储图片与跳转配置)
   */
  homeBanners: string;
  /**
   * 首页公告
   */
  homeNotice: string;
}

export interface PaySysConfigForm extends BaseEntity {
  /**
   * 主键ID (固定为1，全局唯一配置)
   */
  id?: string | number;
  /**
   * 客服电话
   */
  customerServicePhone?: string;
  /**
   * 是否显示小程序退款 (1:显示 0:隐藏)
   */
  showMiniappRefund?: number;
  /**
   * 是否显示手机号 (1:显示 0:隐藏)
   */
  showPhone?: number;
  /**
   * 是否显示身份证 (1:显示 0:隐藏)
   */
  showIdCard?: string | number;
  /**
   * 退款密码
   */
  refundPassword?: string;
  /**
   * 小程序会话
   */
  miniappAesKey?: string;
  /**
   * 小程序密钥
   */
  miniappSecret?: string;
  /**
   * 查询企业的密钥
   */
  enterpriseQueryKey?: string;
  /**
   * 查询的最大次数
   */
  maxQueryLimit?: number;
  /**
   * 服务协议
   */
  serviceAgreement?: string;
  /**
   * 注册协议
   */
  registrationAgreement?: string;
  /**
   * 首页轮播图 (JSON格式存储图片与跳转配置)
   */
  homeBanners?: string;
  /**
   * 首页公告
   */
  homeNotice?: string;
}

export interface PaySysConfigQuery extends PageQuery {
  /**
   * 日期范围参数
   */
  params?: any;
}
