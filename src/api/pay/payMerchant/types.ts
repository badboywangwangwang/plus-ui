export interface PayMerchantVO {
  /**
   * 法人ID
   */
  merchantId: string | number;
  /**
   * 姓名
   */
  legalPersonName: string;
  /**
   * 手机号
   */
  mobile: string;
  /**
   * 备用手机号
   */
  backupMobile: string;
  /**
   * 身份证号
   */
  idCard: string | number;
  /**
   * 银行名称
   */
  bankName: string;
  /**
   * 对公账号
   */
  bankCardNo: string;
  /**
   * 公司名称
   */
  companyName: string;
  /**
   * 公司税号
   */
  taxNo: string;
  /**
   * 公司地址
   */
  companyAddress: string;
  /**
   * 状态（0正常 1停用）
   */
  status: string;
  /**
   * 备注
   */
  remark: string;
}

export interface PayMerchantForm extends BaseEntity {
  /**
   * 法人ID
   */
  merchantId?: string | number;
  /**
   * 姓名
   */
  legalPersonName?: string;
  /**
   * 手机号
   */
  mobile?: string;
  /**
   * 备用手机号
   */
  backupMobile?: string;
  /**
   * 身份证号
   */
  idCard?: string | number;
  /**
   * 银行名称
   */
  bankName?: string;
  /**
   * 对公账号
   */
  bankCardNo?: string;
  /**
   * 公司名称
   */
  companyName?: string;
  /**
   * 公司税号
   */
  taxNo?: string;
  /**
   * 公司地址
   */
  companyAddress?: string;
  /**
   * 状态（0正常 1停用）
   */
  status?: string;
  /**
   * 备注
   */
  remark?: string;
}

export interface PayMerchantQuery extends PageQuery {
  /**
   * 姓名
   */
  legalPersonName?: string;
  /**
   * 日期范围参数
   */
  params?: any;
}
