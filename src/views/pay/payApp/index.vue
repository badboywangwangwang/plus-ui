<template>
  <div class="p-2 page-shell pay-payApp-page">
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
          <el-form-item label="应用名称" prop="appName">
            <el-input v-model="queryParams.appName" placeholder="请输入应用名称" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="应用类型" prop="appType">
            <el-select v-model="queryParams.appType" placeholder="请选择应用类型" clearable>
              <el-option v-for="dict in gan_app_type" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
              <el-option v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.label" :value="dict.value" />
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
            <h3>应用信息列表</h3>
          </div>
          <div class="toolbar-actions">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['pay:payApp:add']">新增</el-button>
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['pay:payApp:edit']">修改</el-button>
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['pay:payApp:remove']">删除</el-button>
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['pay:payApp:export']">导出</el-button>
            <right-toolbar v-model:show-search="showSearch" :search="false" @query-table="getList"></right-toolbar>
          </div>
        </div>
      </template>

      <el-table v-loading="loading" border class="data-table" :data="payAppList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        
        <!-- 💡 修改点 1：通过插槽用 merchantId 动态匹配显示名称 -->
        <el-table-column label="归属法人" align="center" prop="merchantId">
          <template #default="scope">
            <span>{{ formatLegalPersonName(scope.row.merchantId) }}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="应用名称" align="center" prop="appName" />
        <el-table-column label="应用类型" align="center" prop="appType">
          <template #default="scope">
            <dict-tag :options="gan_app_type" :value="scope.row.appType" />
          </template>
        </el-table-column>
       <!-- 应用标识 -->
        <el-table-column label="应用标识" align="center" prop="appIdentity" min-width="160" show-overflow-tooltip>
          <template #default="scope">
            <div class="flex items-center justify-center gap-1">
              <span>{{ maskString(scope.row.appIdentity) }}</span>
              <el-button
                v-if="scope.row.appIdentity"
                link
                type="primary"
                icon="CopyDocument"
                title="复制完整应用标识"
                @click.stop="handleCopy(scope.row.appIdentity)"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="应用密钥" align="center" prop="appSecret" min-width="180" show-overflow-tooltip>
        <template #default="scope">
          <div class="flex items-center justify-center gap-1">
            <span>{{ maskString(scope.row.appSecret) }}</span>
            <el-button
              v-if="scope.row.appSecret"
              link
              type="primary"
              icon="CopyDocument"
              title="复制完整应用密钥"
              @click.stop="handleCopy(scope.row.appSecret)"
            />
          </div>
        </template>
      </el-table-column>
        <el-table-column label="客服类型" align="center" prop="customServiceType">
          <template #default="scope">
            <dict-tag :options="gan_custom_service_type" :value="scope.row.customServiceType" />
          </template>
        </el-table-column>
        <el-table-column label="客服会话" align="center" prop="sessionId" />
       <el-table-column label="注册邮箱" align="center" prop="accountEmail" min-width="180" show-overflow-tooltip>
      <template #default="scope">
        <div class="flex items-center justify-center gap-1">
          <span>{{ maskEmail(scope.row.accountEmail) }}</span>
          <el-button
            v-if="scope.row.accountEmail"
            link
            type="primary"
            icon="CopyDocument"
            title="复制完整注册邮箱"
            @click.stop="handleCopy(scope.row.accountEmail)"
          />
        </div>
      </template>
    </el-table-column>
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
              <el-button link type="primary" icon="Edit" @click="handleOpenRelModal(scope.row)" v-hasPermi="['pay:payApp:edit']"></el-button>
            </el-tooltip>

            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['pay:payApp:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['pay:payApp:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>

    <!-- 添加或修改应用信息对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="payAppFormRef" :model="form" :rules="rules" label-width="80px">
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
        <el-form-item label="应用名称" prop="appName">
          <el-input v-model="form.appName" placeholder="请输入应用名称" />
        </el-form-item>
        <el-form-item label="应用类型" prop="appType">
          <el-select v-model="form.appType" placeholder="请选择应用类型">
            <el-option
              v-for="dict in gan_app_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="应用标识" prop="appIdentity">
          <el-input v-model="form.appIdentity" placeholder="请输入应用标识" />
        </el-form-item>
        <el-form-item label="应用密钥" prop="appSecret">
          <el-input v-model="form.appSecret" placeholder="请输入应用密钥" />
        </el-form-item>
        <el-form-item label="客服类型" prop="customServiceType">
          <el-select v-model="form.customServiceType" placeholder="请选择客服类型">
            <el-option
              v-for="dict in gan_custom_service_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客服会话" prop="sessionId">
          <el-input v-model="form.sessionId" placeholder="请输入客服会话" />
        </el-form-item>
        <el-form-item label="注册邮箱" prop="accountEmail">
          <el-input v-model="form.accountEmail" placeholder="请输入注册邮箱" />
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

    <!-- 💡 2. 挂载弹窗组件 -->
    <AppConfigRelModal
      v-model="relModalVisible"
      :app-id="currentAppId"
      :app-name="currentAppName"
    />
  </div>
</template>

<script setup name="PayApp" lang="ts">
import {
  addPayApp,
  changePayAppStatus,
  delPayApp,
  getPayApp,
  listPayApp,
  updatePayApp
} from '@/api/pay/payApp';
import { listPayMerchant } from "@/api/pay/payMerchant";
import { PayAppForm, PayAppQuery, PayAppVO } from '@/api/pay/payApp/types';
import { useLoading } from '@/hooks/async/useLoading';
import { useFormDialog } from '@/hooks/dialog/useFormDialog';
import { useSearchReset } from '@/hooks/form/useSearchReset';
import { useSearchToggle } from '@/hooks/form/useSearchToggle';
import { useTableSelection } from '@/hooks/table/useTableSelection';
import { useDict } from '@/utils/dict';
import modal from '@/plugins/modal';
import { download as requestDownload } from '@/utils/request';
// 💡 3. 引入刚才创建的弹窗组件
import AppConfigRelModal from '../payAppConfigRelModal/index.vue';
const appList = ref([]); // 你的应用列表数据
const { gan_custom_service_type, gan_app_type, sys_normal_disable } = toRefs<any>(useDict('gan_custom_service_type', 'gan_app_type', 'sys_normal_disable'));

const statusActiveValue = '0';
const statusInactiveValue = '1';

const payAppList = ref<PayAppVO[]>([]);
const merchantOptions = ref<any[]>([]); // 仅用于下拉框选项
const buttonLoading = ref(false);
const { loading, withLoading } = useLoading(true);
const { showSearch } = useSearchToggle();
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const payAppFormRef = ref<ElFormInstance>();


  // 弹窗状态控制
const relModalVisible = ref(false);
const currentAppId = ref<number | string | null>(null);
const currentAppName = ref('');

const initFormData: PayAppForm = {
  appId: undefined,
  merchantId: undefined,
  appName: undefined,
  appType: undefined,
  appIdentity: undefined,
  appSecret: undefined,
  customServiceType: undefined,
  sessionId: undefined,
  accountEmail: undefined,
  status: '0',
};

const data = reactive<PageData<PayAppForm, PayAppQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    merchantId: undefined,
    appName: undefined,
    appType: undefined,
    status: undefined,
    params: {}
  },
  rules: {
    merchantId: [
      { required: true, message: "归属法人不能为空", trigger: "change" }
    ],
    appName: [
      { required: true, message: "应用名称不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);
const { ids, single, multiple, handleSelectionChange } = useTableSelection<PayAppVO>(item => item.appId);
const { dialog, resetForm: reset, openDialog, showDialog, closeDialog } = useFormDialog({
  form,
  formRef: payAppFormRef,
  initialFormData: initFormData
});

/** 💡 修改点 2：增加转换函数 */
const formatLegalPersonName = (merchantId: string | number) => {
  if (!merchantId) return '-';
  const target = merchantOptions.value.find(item => String(item.merchantId) === String(merchantId));
  return target ? (target.legalPersonName || target.companyName || merchantId) : merchantId;
};

/** 加载下拉框专用的法人列表 */
const getMerchantOptions = async () => {
  try {
    const res: any = await listPayMerchant({ pageNum: 1, pageSize: 100 });
    merchantOptions.value = res.data?.rows || res.rows || [];
  } catch (error) {
    console.error('获取法人下拉列表失败', error);
  }
};

/** 查询应用信息列表 */
const getList = async () => {
  await withLoading(async () => {
    const res = await listPayApp(queryParams.value);
    payAppList.value = res.data?.rows;
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
  resetExtras: () => {},
  afterReset: () => {
    handleQuery();
  }
});

/** 新增按钮操作 */
const handleAdd = () => {
  openDialog('添加应用信息');
};

/** 修改按钮操作 */
const handleUpdate = async (row?: Partial<PayAppVO>) => {
  reset();
  const _appId = row?.appId || ids.value[0];
  const res = await getPayApp(_appId);
  Object.assign(form.value, res.data);
  showDialog('修改应用信息');
};

/** 提交按钮 */
const submitForm = () => {
  payAppFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.appId) {
        await updatePayApp(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addPayApp(form.value).finally(() => (buttonLoading.value = false));
      }
      modal.msgSuccess('操作成功');
      closeDialog();
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: Partial<PayAppVO>) => {
  const _appIds = row?.appId || ids.value;
  await modal.confirm('是否确认删除应用信息编号为"' + _appIds + '"的数据项？');
  await delPayApp(_appIds);
  modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  requestDownload(
    'pay/payApp/export',
    {
      ...queryParams.value
    },
    `payApp_${new Date().getTime()}.xlsx`
  );
};

/** 状态修改 */
const handleStatusChange = async (row: Partial<PayAppVO>) => {
  const text = row.status === statusActiveValue ? '启用' : '停用';
  try {
    await modal.confirm('确认要"' + text + '"吗?');
    await changePayAppStatus(row.appId, row.status);
    modal.msgSuccess(text + '成功');
  } catch (err) {
    row.status = row.status === statusActiveValue ? statusInactiveValue : statusActiveValue;
  }
};

/** 💡 字符串脱敏处理：只留前4位和后4位，中间用 **** 代替 */
const maskString = (val?: string | null) => {
  if (!val) return '-';
  const str = String(val).trim();
  // 如果长度不超过 8 位，说明无法保留“前4后4”，直接原样展示（或自行调整策略）
  if (str.length <= 8) {
    return str;
  }
  return `${str.slice(0, 4)}****${str.slice(-4)}`;
};

/** 复制文本到剪贴板 */
const handleCopy = async (text: string) => {
  if (!text) return;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      // 兼容本地非 HTTPS 环境
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    modal.msgSuccess('复制成功');
  } catch (err) {
    modal.msgError('复制失败');
  }
};

/** 💡 邮箱专门脱敏函数：如 test12345@gmail.com -> te****45@gmail.com */
const maskEmail = (val?: string | null) => {
  if (!val) return '-';
  const str = String(val).trim();
  const atIndex = str.indexOf('@');
  if (atIndex <= 2) return str; // 如果 @ 前面字符太短就不强行掩码了
  
  const name = str.slice(0, atIndex);
  const domain = str.slice(atIndex);
  
  if (name.length <= 4) {
    return `${name.slice(0, 1)}****${domain}`;
  }
  return `${name.slice(0, 2)}****${name.slice(-2)}${domain}`;
};

// 点击按钮打开弹窗
const handleOpenRelModal = (row: any) => {
  currentAppId.value = row.appId;
  currentAppName.value = row.appName;
  relModalVisible.value = true;
};

onMounted(() => {
  getMerchantOptions(); // 加载表单下拉框选项
  getList();            // 加载主表格数据
});
</script>