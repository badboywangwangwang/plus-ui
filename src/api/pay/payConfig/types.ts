export interface PayConfigVO {
  /**
   * 配置主键ID
   */
  configId: string | number;
  /**
   * 归属法人
   */
  merchantId: string | number;
  /**
   * 商户名称
   */
  configName: string;
  /**
   * 支付渠道
   */
  channelType: string;
  /**
   * 商户模式
   */
  mchMode: string;
  /**
   * 商户号
   */
  mchId: string | number;
  /**
   * 状态（0启用 1停用）
   */
  status: string;
  /**
   * 备注
   */
  remark: string;
}

export interface PayConfigForm extends BaseEntity {
  /**
   * 配置主键ID
   */
  configId?: string | number;
  /**
   * 归属法人
   */
  merchantId?: string | number;
  /**
   * 商户名称
   */
  configName?: string;
  /**
   * 支付渠道
   */
  channelType?: string;
  /**
   * 商户模式
   */
  mchMode?: string;
  /**
   * 商户号
   */
  mchId?: string | number;
  /**
   * 子商户号
   */
  subMchId?: string | number;
  /**
   * 证书在 COS 的下载 URL
   */
  certCosUrl?: string;
  /**
   * 私钥在 COS 的下载 URL
   */
  keyCosUrl?: string;
  /**
   * 动态参数 JSON
   */
  extraConfig?: string;
  /**
   * 是否开启分账（0否 1是）
   */
  isProfitSharing?: string;
  /**
   * 分账比例上限(%)
   */
  maxSharingRatio?: number;
  /**
   * 状态（0启用 1停用）
   */
  status?: string;
  /**
   * 备注
   */
  remark?: string;
}

export interface PayConfigQuery extends PageQuery {
  /**
   * 归属法人
   */
  merchantId?: string | number;
  /**
   * 商户名称
   */
  configName?: string;
  /**
   * 支付渠道
   */
  channelType?: string;
  /**
   * 商户模式
   */
  mchMode?: string;
  /**
   * 商户号
   */
  mchId?: string | number;
  /**
   * 状态（0启用 1停用）
   */
  status?: string;
  /**
   * 日期范围参数
   */
  params?: any;
}
