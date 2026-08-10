<template>
  <div class="p-2 page-shell pay-payConfig-page">
    <div class="search-wrap">
      <el-card shadow="hover" class="search-panel" :class="{ 'is-collapsed': !showSearch }">
        <template #header>
          <div class="panel-heading search-panel-toggle" @click.stop="showSearch = !showSearch">
            <div><h3>筛选条件</h3></div>
          </div>
        </template>
        <el-form ref="queryFormRef" :model="queryParams" :inline="true" class="query-form">
          <!-- 搜索项：按归属法人筛选 -->
          <el-form-item label="归属法人" prop="merchantId">
            <el-select
              v-model="queryParams.merchantId"
              placeholder="请选择归属法人"
              clearable
              filterable
              style="width: 200px"
            >
              <el-option
                v-for="item in merchantOptions"
                :key="item.merchantId"
                :label="item.legalPersonName || item.companyName"
                :value="item.merchantId"
              />
            </el-select>
          </el-form-item>

            <el-form-item label="商户号" prop="mchId">
              <el-input v-model="queryParams.mchId" placeholder="请输入商户号" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="queryParams.status" placeholder="请选择状态" clearable >
                <el-option v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.label" :value="dict.value"/>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>
      </el-card>
    </div>

    <el-card shadow="hover" class="table-panel">
      <template #header>
        <div class="toolbar-shell">
          <div class="table-heading">
            <h3>支付通道与商户配置列表</h3>
          </div>
          <div class="toolbar-actions">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['pay:payConfig:add']">新增</el-button>
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['pay:payConfig:edit']">修改</el-button>
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['pay:payConfig:remove']">删除</el-button>
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['pay:payConfig:export']">导出</el-button>
            <right-toolbar v-model:show-search="showSearch" :search="false" @query-table="getList"></right-toolbar>
          </div>
        </div>
      </template>

      <el-table v-loading="loading" border class="data-table" :data="payConfigList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="归属法人" align="center" prop="merchantId">
        <template #default="scope">
          <span>{{ formatLegalPersonName(scope.row.merchantId) }}</span>
        </template>
      </el-table-column>
        <el-table-column label="商户名称" align="center" prop="configName" />
        <el-table-column label="支付渠道" align="center" prop="channelType">
          <template #default="scope">
            <dict-tag :options="gan_pay_channel" :value="scope.row.channelType"/>
          </template>
        </el-table-column>
        <el-table-column label="商户模式" align="center" prop="mchMode">
          <template #default="scope">
            <dict-tag :options="gan_mch_mode" :value="scope.row.mchMode"/>
          </template>
        </el-table-column>
        <el-table-column label="商户号" align="center" prop="mchId" />
        <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="statusActiveValue"
              :inactive-value="statusInactiveValue"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['pay:payConfig:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['pay:payConfig:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改支付通道与商户配置对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="payConfigFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="归属法人" prop="merchantId">
          <el-select
            v-model="form.merchantId"
            placeholder="请选择归属法人"
            clearable
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="item in merchantOptions"
              :key="item.merchantId"
              :label="item.legalPersonName || item.companyName"
              :value="item.merchantId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商户名称" prop="configName">
          <el-input v-model="form.configName" placeholder="请输入商户名称" />
        </el-form-item>
        <el-form-item label="支付渠道" prop="channelType">
          <el-select v-model="form.channelType" placeholder="请选择支付渠道">
            <el-option
                v-for="dict in gan_pay_channel"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商户模式" prop="mchMode">
          <el-select v-model="form.mchMode" placeholder="请选择商户模式">
            <el-option
                v-for="dict in gan_mch_mode"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商户号" prop="mchId">
          <el-input v-model="form.mchId" placeholder="请输入商户号" />
        </el-form-item>
        <el-form-item label="子商户号" prop="subMchId">
          <el-input v-model="form.subMchId" placeholder="请输入子商户号" />
        </el-form-item>
        <el-form-item label="证书地址" prop="certCosUrl">
            <el-input v-model="form.certCosUrl" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="私钥地址" prop="keyCosUrl">
            <el-input v-model="form.keyCosUrl" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="动态参数" prop="extraConfig">
          <el-input v-model="form.extraConfig" placeholder="请输入动态参数" />
        </el-form-item>
        <el-form-item label="是否分账" prop="isProfitSharing">
          <el-switch
            v-model="form.isProfitSharing"
            active-value="0"
            inactive-value="1"
          />
        </el-form-item>
        <el-form-item label="分账上限" prop="maxSharingRatio">
          <el-input-number v-model="form.maxSharingRatio" controls-position="right" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="form.status"
            active-value="0"
            inactive-value="1"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="PayConfig" lang="ts">
import {
  addPayConfig,
  changePayConfigStatus,
  delPayConfig,
  getPayConfig,
  listPayConfig,
  updatePayConfig
} from '@/api/pay/payConfig';
import { PayConfigForm, PayConfigQuery, PayConfigVO } from '@/api/pay/payConfig/types';
import { listPayMerchant } from "@/api/pay/payMerchant";
import { useLoading } from '@/hooks/async/useLoading';
import { useFormDialog } from '@/hooks/dialog/useFormDialog';
import { useSearchReset } from '@/hooks/form/useSearchReset';
import { useSearchToggle } from '@/hooks/form/useSearchToggle';
import { useTableSelection } from '@/hooks/table/useTableSelection';
import { useDict } from '@/utils/dict';
import modal from '@/plugins/modal';
import { download as requestDownload } from '@/utils/request';

const { gan_mch_mode, gan_sharing_status, sys_normal_disable, gan_pay_channel } = toRefs<any>(useDict('gan_mch_mode', 'gan_sharing_status', 'sys_normal_disable', 'gan_pay_channel'));

const statusActiveValue = '0';
const statusInactiveValue = '1';

const payConfigList = ref<PayConfigVO[]>([]);
const merchantOptions = ref<any[]>([]); // 仅用于下拉框选项
const buttonLoading = ref(false);
const { loading, withLoading } = useLoading(true);
const { showSearch } = useSearchToggle();
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const payConfigFormRef = ref<ElFormInstance>();

const initFormData: PayConfigForm = {
  configId: undefined,
  merchantId: undefined,
  configName: undefined,
  channelType: undefined,
  mchMode: undefined,
  mchId: undefined,
  subMchId: undefined,
  certCosUrl: undefined,
  keyCosUrl: undefined,
  extraConfig: undefined,
  isProfitSharing: undefined,
  maxSharingRatio: undefined,
  status: undefined,
}
const data = reactive<PageData<PayConfigForm, PayConfigQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    merchantId: undefined,
    mchId: undefined,
    status: undefined,
    params: {
    }
  },
  rules: {
configId: [
      { required: true, message: "配置主键ID不能为空", trigger: "change" }
    ],
merchantId: [
      { required: true, message: "归属法人不能为空", trigger: "change" }
    ],
configName: [
      { required: true, message: "商户名称不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);
const { ids, single, multiple, handleSelectionChange } = useTableSelection<PayConfigVO>(item => item.configId);
const { dialog, resetForm: reset, openDialog, showDialog, closeDialog } = useFormDialog({
  form,
  formRef: payConfigFormRef,
  initialFormData: initFormData
});

/** 查询支付通道与商户配置列表 */
const getList = async () => {
  await withLoading(async () => {
    const res = await listPayConfig(queryParams.value);
    payConfigList.value = res.data?.rows;
    total.value = res.data?.total;
  });
};

/** 取消按钮 */
const cancel = () => {
  reset();
  closeDialog();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

const { resetQuery } = useSearchReset({
  queryFormRef,
  queryParams,
  pageNumKey: 'pageNum',
  pageSizeKey: 'pageSize',
  initialPageSize: 10,
  resetExtras: () => {
  },
  afterReset: () => {
    handleQuery();
  }
});

/** 新增按钮操作 */
const handleAdd = () => {
  openDialog('添加支付通道与商户配置');
};

/** 修改按钮操作 */
const handleUpdate = async (row?: Partial<PayConfigVO>) => {
  reset();
  const _configId = row?.configId || ids.value[0];
  const res = await getPayConfig(_configId);
  Object.assign(form.value, res.data);
  showDialog('修改支付通道与商户配置');
};

/** 提交按钮 */
const submitForm = () => {
  payConfigFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.configId) {
        await updatePayConfig(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addPayConfig(form.value).finally(() => (buttonLoading.value = false));
      }
      modal.msgSuccess('操作成功');
      closeDialog();
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: Partial<PayConfigVO>) => {
  const _configIds = row?.configId || ids.value;
  await modal.confirm('是否确认删除支付通道与商户配置编号为"' + _configIds + '"的数据项？');
  await delPayConfig(_configIds);
  modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  requestDownload(
    'pay/payConfig/export',
    {
      ...queryParams.value
    },
    `payConfig_${new Date().getTime()}.xlsx`
  );
};

/** 状态修改 */
const handleStatusChange = async (row: Partial<PayConfigVO>) => {
  const text = row.status === statusActiveValue ? '启用' : '停用';
  try {
    await modal.confirm('确认要"' + text + '"吗?');
    await changePayConfigStatus(row.configId, row.status);
    modal.msgSuccess(text + '成功');
  } catch (err) {
    row.status = row.status === statusActiveValue ? statusInactiveValue : statusActiveValue;
  }
};



/** 💡 匹配函数：根据 merchantId 转换为对应的法人姓名 */
const formatLegalPersonName = (merchantId: string | number) => {
  if (!merchantId) return '-';
  const target = merchantOptions.value.find(item => String(item.merchantId) === String(merchantId));
  return target ? (target.legalPersonName || target.companyName || merchantId) : merchantId;
};

/** 💡 获取法人下拉列表 */
const getMerchantOptions = async () => {
  try {
    const res: any = await listPayMerchant({ pageNum: 1, pageSize: 100 });
    merchantOptions.value = res.data?.rows || res.rows || [];
  } catch (error) {
    console.error('获取法人下拉列表失败', error);
  }
};


onMounted(() => {
  getMerchantOptions();
  getList();
});
</script>

