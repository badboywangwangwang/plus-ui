<template>
  <div class="p-2 page-shell pay-payMerchant-page">
    <div class="search-wrap">
      <el-card shadow="hover" class="search-panel" :class="{ 'is-collapsed': !showSearch }">
        <template #header>
          <div class="panel-heading search-panel-toggle" @click.stop="showSearch = !showSearch">
            <div><h3>筛选条件</h3></div>
          </div>
        </template>
        <el-form ref="queryFormRef" :model="queryParams" :inline="true" class="query-form">
            <el-form-item label="姓名" prop="legalPersonName">
              <el-input v-model="queryParams.legalPersonName" placeholder="请输入姓名" clearable @keyup.enter="handleQuery" />
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
            <h3>法人信息列表</h3>
          </div>
          <div class="toolbar-actions">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['pay:payMerchant:add']">新增</el-button>
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['pay:payMerchant:edit']">修改</el-button>
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['pay:payMerchant:remove']">删除</el-button>
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['pay:payMerchant:export']">导出</el-button>
            <right-toolbar v-model:show-search="showSearch" :search="false" @query-table="getList"></right-toolbar>
          </div>
        </div>
      </template>

      <el-table v-loading="loading" border class="data-table" :data="payMerchantList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="姓名" align="center" prop="legalPersonName" />
        <el-table-column label="手机号" align="center" prop="mobile" />
        <el-table-column label="备用手机" align="center" prop="backupMobile" />
        <el-table-column label="身份证号" align="center" prop="idCard" />
        <el-table-column label="银行名称" align="center" prop="bankName" />
        <el-table-column label="对公账号" align="center" prop="bankCardNo" />
        <el-table-column label="公司名称" align="center" prop="companyName" />
        <el-table-column label="公司税号" align="center" prop="taxNo" />
        <el-table-column label="公司地址" align="center" prop="companyAddress" />
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
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['pay:payMerchant:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['pay:payMerchant:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改法人信息对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="payMerchantFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="姓名" prop="legalPersonName">
          <el-input v-model="form.legalPersonName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="备用手机" prop="backupMobile">
          <el-input v-model="form.backupMobile" placeholder="请输入备用手机" />
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="form.idCard" placeholder="请输入身份证号" />
        </el-form-item>
        <el-form-item label="银行名称" prop="bankName">
          <el-input v-model="form.bankName" placeholder="请输入银行名称" />
        </el-form-item>
        <el-form-item label="对公账号" prop="bankCardNo">
          <el-input v-model="form.bankCardNo" placeholder="请输入对公账号" />
        </el-form-item>
        <el-form-item label="公司名称" prop="companyName">
          <el-input v-model="form.companyName" placeholder="请输入公司名称" />
        </el-form-item>
        <el-form-item label="公司税号" prop="taxNo">
          <el-input v-model="form.taxNo" placeholder="请输入公司税号" />
        </el-form-item>
        <el-form-item label="公司地址" prop="companyAddress">
          <el-input v-model="form.companyAddress" placeholder="请输入公司地址" />
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

<script setup name="PayMerchant" lang="ts">
import {
  addPayMerchant,
  changePayMerchantStatus,
  delPayMerchant,
  getPayMerchant,
  listPayMerchant,
  updatePayMerchant
} from '@/api/pay/payMerchant';
import { PayMerchantForm, PayMerchantQuery, PayMerchantVO } from '@/api/pay/payMerchant/types';
import { useLoading } from '@/hooks/async/useLoading';
import { useFormDialog } from '@/hooks/dialog/useFormDialog';
import { useSearchReset } from '@/hooks/form/useSearchReset';
import { useSearchToggle } from '@/hooks/form/useSearchToggle';
import { useTableSelection } from '@/hooks/table/useTableSelection';
import { useDict } from '@/utils/dict';
import modal from '@/plugins/modal';
import { download as requestDownload } from '@/utils/request';

const { sys_normal_disable } = toRefs<any>(useDict('sys_normal_disable'));

const statusActiveValue = '0';
const statusInactiveValue = '1';

const payMerchantList = ref<PayMerchantVO[]>([]);
const buttonLoading = ref(false);
const { loading, withLoading } = useLoading(true);
const { showSearch } = useSearchToggle();
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const payMerchantFormRef = ref<ElFormInstance>();

const initFormData: PayMerchantForm = {
  merchantId: undefined,
  legalPersonName: undefined,
  mobile: undefined,
  backupMobile: undefined,
  idCard: undefined,
  bankName: undefined,
  bankCardNo: undefined,
  companyName: undefined,
  taxNo: undefined,
  companyAddress: undefined,
  status: undefined,
}
const data = reactive<PageData<PayMerchantForm, PayMerchantQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    legalPersonName: undefined,
    params: {
    }
  },
  rules: {
merchantId: [
      { required: true, message: "法人ID不能为空", trigger: "change" }
    ],
legalPersonName: [
      { required: true, message: "姓名不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);
const { ids, single, multiple, handleSelectionChange } = useTableSelection<PayMerchantVO>(item => item.merchantId);
const { dialog, resetForm: reset, openDialog, showDialog, closeDialog } = useFormDialog({
  form,
  formRef: payMerchantFormRef,
  initialFormData: initFormData
});

/** 查询法人信息列表 */
const getList = async () => {
  await withLoading(async () => {
    const res = await listPayMerchant(queryParams.value);
    payMerchantList.value = res.data?.rows;
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
  openDialog('添加法人信息');
};

/** 修改按钮操作 */
const handleUpdate = async (row?: Partial<PayMerchantVO>) => {
  reset();
  const _merchantId = row?.merchantId || ids.value[0];
  const res = await getPayMerchant(_merchantId);
  Object.assign(form.value, res.data);
  showDialog('修改法人信息');
};

/** 提交按钮 */
const submitForm = () => {
  payMerchantFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.merchantId) {
        await updatePayMerchant(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addPayMerchant(form.value).finally(() => (buttonLoading.value = false));
      }
      modal.msgSuccess('操作成功');
      closeDialog();
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: Partial<PayMerchantVO>) => {
  const _merchantIds = row?.merchantId || ids.value;
  await modal.confirm('是否确认删除法人信息编号为"' + _merchantIds + '"的数据项？');
  await delPayMerchant(_merchantIds);
  modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  requestDownload(
    'pay/payMerchant/export',
    {
      ...queryParams.value
    },
    `payMerchant_${new Date().getTime()}.xlsx`
  );
};

/** 状态修改 */
const handleStatusChange = async (row: Partial<PayMerchantVO>) => {
  const text = row.status === statusActiveValue ? '启用' : '停用';
  try {
    await modal.confirm('确认要"' + text + '"吗?');
    await changePayMerchantStatus(row.merchantId, row.status);
    modal.msgSuccess(text + '成功');
  } catch (err) {
    row.status = row.status === statusActiveValue ? statusInactiveValue : statusActiveValue;
  }
};


onMounted(() => {
  getList();
});
</script>

