<template>
  <div class="p-2 page-shell pay-paySysConfig-page">
    <div class="search-wrap">
      <el-card shadow="hover" class="search-panel" :class="{ 'is-collapsed': !showSearch }">
        <template #header>
          <div class="panel-heading search-panel-toggle" @click.stop="showSearch = !showSearch">
            <div><h3>筛选条件</h3></div>
          </div>
        </template>
        <el-form ref="queryFormRef" :model="queryParams" :inline="true" class="query-form">
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
            <h3>系统配置列表</h3>
          </div>
          <div class="toolbar-actions">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['pay:paySysConfig:add']">新增</el-button>
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['pay:paySysConfig:edit']">修改</el-button>
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['pay:paySysConfig:remove']">删除</el-button>
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['pay:paySysConfig:export']">导出</el-button>
            <right-toolbar v-model:show-search="showSearch" :search="false" @query-table="getList"></right-toolbar>
          </div>
        </div>
      </template>

      <el-table v-loading="loading" border class="data-table" :data="paySysConfigList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键ID (固定为1，全局唯一配置)" align="center" prop="id" />
        <el-table-column label="客服电话" align="center" prop="customerServicePhone" />
        <el-table-column label="是否显示小程序退款 (1:显示 0:隐藏)" align="center" prop="showMiniappRefund">
          <template #default="scope">
            <dict-tag :options="sys_yes_no" :value="scope.row.showMiniappRefund"/>
          </template>
        </el-table-column>
        <el-table-column label="是否显示手机号 (1:显示 0:隐藏)" align="center" prop="showPhone">
          <template #default="scope">
            <dict-tag :options="sys_yes_no" :value="scope.row.showPhone"/>
          </template>
        </el-table-column>
        <el-table-column label="是否显示身份证 (1:显示 0:隐藏)" align="center" prop="showIdCard">
          <template #default="scope">
            <dict-tag :options="sys_yes_no" :value="scope.row.showIdCard"/>
          </template>
        </el-table-column>
        <el-table-column label="退款密码" align="center" prop="refundPassword" />
        <el-table-column label="小程序会话" align="center" prop="miniappAesKey" />
        <el-table-column label="小程序密钥" align="center" prop="miniappSecret" />
        <el-table-column label="查询企业的密钥" align="center" prop="enterpriseQueryKey" />
        <el-table-column label="查询的最大次数" align="center" prop="maxQueryLimit" />
        <el-table-column label="服务协议" align="center" prop="serviceAgreement" />
        <el-table-column label="注册协议" align="center" prop="registrationAgreement" />
        <el-table-column label="首页轮播图 (JSON格式存储图片与跳转配置)" align="center" prop="homeBanners" />
        <el-table-column label="首页公告" align="center" prop="homeNotice" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['pay:paySysConfig:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['pay:paySysConfig:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改系统配置对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="paySysConfigFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="客服电话" prop="customerServicePhone">
          <el-input v-model="form.customerServicePhone" placeholder="请输入客服电话" />
        </el-form-item>
        <el-form-item label="是否显示小程序退款 (1:显示 0:隐藏)" prop="showMiniappRefund">
          <el-radio-group v-model="form.showMiniappRefund">
            <el-radio
              v-for="dict in sys_yes_no"
              :key="dict.value"
              :value="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否显示手机号 (1:显示 0:隐藏)" prop="showPhone">
          <el-radio-group v-model="form.showPhone">
            <el-radio
              v-for="dict in sys_yes_no"
              :key="dict.value"
              :value="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否显示身份证 (1:显示 0:隐藏)" prop="showIdCard">
          <el-radio-group v-model="form.showIdCard">
            <el-radio
              v-for="dict in sys_yes_no"
              :key="dict.value"
              :value="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="退款密码" prop="refundPassword">
          <el-input v-model="form.refundPassword" placeholder="请输入退款密码" />
        </el-form-item>
        <el-form-item label="小程序会话" prop="miniappAesKey">
          <el-input v-model="form.miniappAesKey" placeholder="请输入小程序会话" />
        </el-form-item>
        <el-form-item label="小程序密钥" prop="miniappSecret">
          <el-input v-model="form.miniappSecret" placeholder="请输入小程序密钥" />
        </el-form-item>
        <el-form-item label="查询企业的密钥" prop="enterpriseQueryKey">
          <el-input v-model="form.enterpriseQueryKey" placeholder="请输入查询企业的密钥" />
        </el-form-item>
        <el-form-item label="查询的最大次数" prop="maxQueryLimit">
          <el-input-number v-model="form.maxQueryLimit" controls-position="right" />
        </el-form-item>
        <el-form-item label="服务协议" prop="serviceAgreement">
            <el-input v-model="form.serviceAgreement" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="注册协议" prop="registrationAgreement">
            <el-input v-model="form.registrationAgreement" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="首页轮播图 (JSON格式存储图片与跳转配置)" prop="homeBanners">
          <el-input v-model="form.homeBanners" placeholder="请输入首页轮播图 (JSON格式存储图片与跳转配置)" />
        </el-form-item>
        <el-form-item label="首页公告" prop="homeNotice">
            <el-input v-model="form.homeNotice" type="textarea" placeholder="请输入内容" />
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

<script setup name="PaySysConfig" lang="ts">
import {
  addPaySysConfig,
  delPaySysConfig,
  getPaySysConfig,
  listPaySysConfig,
  updatePaySysConfig
} from '@/api/pay/paySysConfig';
import { PaySysConfigForm, PaySysConfigQuery, PaySysConfigVO } from '@/api/pay/paySysConfig/types';
import { useLoading } from '@/hooks/async/useLoading';
import { useFormDialog } from '@/hooks/dialog/useFormDialog';
import { useSearchReset } from '@/hooks/form/useSearchReset';
import { useSearchToggle } from '@/hooks/form/useSearchToggle';
import { useTableSelection } from '@/hooks/table/useTableSelection';
import { useDict } from '@/utils/dict';
import modal from '@/plugins/modal';
import { download as requestDownload } from '@/utils/request';

const { sys_yes_no } = toRefs<any>(useDict('sys_yes_no'));


const paySysConfigList = ref<PaySysConfigVO[]>([]);
const buttonLoading = ref(false);
const { loading, withLoading } = useLoading(true);
const { showSearch } = useSearchToggle();
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const paySysConfigFormRef = ref<ElFormInstance>();

const initFormData: PaySysConfigForm = {
  id: undefined,
  customerServicePhone: undefined,
  showMiniappRefund: undefined,
  showPhone: undefined,
  showIdCard: undefined,
  refundPassword: undefined,
  miniappAesKey: undefined,
  miniappSecret: undefined,
  enterpriseQueryKey: undefined,
  maxQueryLimit: undefined,
  serviceAgreement: undefined,
  registrationAgreement: undefined,
  homeBanners: undefined,
  homeNotice: undefined,
}
const data = reactive<PageData<PaySysConfigForm, PaySysConfigQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    params: {
    }
  },
  rules: {
id: [
      { required: true, message: "主键ID (固定为1，全局唯一配置)不能为空", trigger: "change" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);
const { ids, single, multiple, handleSelectionChange } = useTableSelection<PaySysConfigVO>(item => item.id);
const { dialog, resetForm: reset, openDialog, showDialog, closeDialog } = useFormDialog({
  form,
  formRef: paySysConfigFormRef,
  initialFormData: initFormData
});

/** 查询系统配置列表 */
const getList = async () => {
  await withLoading(async () => {
    const res = await listPaySysConfig(queryParams.value);
    paySysConfigList.value = res.data?.rows;
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
  openDialog('添加系统配置');
};

/** 修改按钮操作 */
const handleUpdate = async (row?: Partial<PaySysConfigVO>) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getPaySysConfig(_id);
  Object.assign(form.value, res.data);
  showDialog('修改系统配置');
};

/** 提交按钮 */
const submitForm = () => {
  paySysConfigFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updatePaySysConfig(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addPaySysConfig(form.value).finally(() => (buttonLoading.value = false));
      }
      modal.msgSuccess('操作成功');
      closeDialog();
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: Partial<PaySysConfigVO>) => {
  const _ids = row?.id || ids.value;
  await modal.confirm('是否确认删除系统配置编号为"' + _ids + '"的数据项？');
  await delPaySysConfig(_ids);
  modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  requestDownload(
    'pay/paySysConfig/export',
    {
      ...queryParams.value
    },
    `paySysConfig_${new Date().getTime()}.xlsx`
  );
};



onMounted(() => {
  getList();
});
</script>

