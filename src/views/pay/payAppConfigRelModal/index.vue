<template>
  <el-dialog
    v-model="visible"
    :title="`绑定支付通道 - ${appName}`"
    width="850px"
    destroy-on-close
    @close="handleClose"
  >
    <!-- 顶部新增绑定操作区 -->
    <el-form :model="form" ref="formRef" :rules="rules" inline class="mb-4">
      <el-form-item label="支付配置" prop="configId" label-width="80">
        <el-select
          v-model="form.configId"
          placeholder="请选择商户配置"
          style="width: 260px"
          clearable
          filterable
        >
          <!-- 💡 绑定商户配置下拉数据 -->
          <el-option
            v-for="item in configOptions"
            :key="item.configId"
            :label="`${item.configName || '配置'} (${item.mchId || '无商户号'})`"
            :value="item.configId"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="默认通道" prop="isDefault">
        <el-switch v-model="form.isDefault" active-value="1" inactive-value="0" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="Plus" :loading="submitLoading" @click="handleAddRel">新增绑定</el-button>
      </el-form-item>
    </el-form>

    <!-- 已绑定列表 -->
    <el-table :data="boundList" v-loading="loading" border stripe>
      <!-- 💡 后端关联查询出来的商户配置信息 -->
      <el-table-column label="配置名称" prop="configName" min-width="140" />
      <el-table-column label="支付渠道" prop="channelType" width="100" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.channelType === 'wxpay'" type="success">微信支付</el-tag>
          <el-tag v-else-if="scope.row.channelType === 'alipay'">支付宝</el-tag>
          <el-tag v-else type="info">{{ scope.row.channelType || '第三方' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="商户号 (MCH_ID)" prop="mchId" min-width="130" align="center" />
      <el-table-column label="是否默认" width="90" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.isDefault === '1'" type="success">是</el-tag>
          <el-tag v-else type="info">否</el-tag>
        </template>
      </el-table-column>
      <!-- 💡 操作列：增加【设为默认】按钮 -->
      <el-table-column label="操作" width="260" align="center">
        <template #default="scope">
          <el-button
            v-if="scope.row.isDefault !== '1'"
            link
            type="primary"
            icon="Check"
            @click="handleSetDefault(scope.row)"
          >
            设为默认
          </el-button>
          <el-button
            v-else
            link
            type="info"
            disabled
          >
            默认通道
          </el-button>
          
          <el-button link type="danger" icon="Delete" @click="handleDelete(scope.row.id)">解绑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus';
import { listPayConfig } from '@/api/pay/payConfig'; // 引入现有商户配置API
import {
  addPayAppConfigRel,
  delPayAppConfigRel,
  listPayAppConfigRel,
  updatePayAppConfigRel
} from '@/api/pay/payAppConfigRel';

const props = defineProps<{
  modelValue: boolean;
  appId: number | string | null;
  appName: string;
}>();

const emit = defineEmits(['update:modelValue']);

const visible = ref(false);
const loading = ref(false);
const submitLoading = ref(false);
const formRef = ref<FormInstance>();

const boundList = ref<any[]>([]);
const configOptions = ref<any[]>([]);

const form = reactive({
  configId: null as number | string | null,
  isDefault: '1',
});

const rules = {
  configId: [{ required: true, message: '请选择支付商户配置', trigger: 'change' }],
};

watch(() => props.modelValue, async (val) => {
  visible.value = val;
  if (val && props.appId) {
    resetForm();
    await loadConfigOptions(); // 先加载配置下拉
    loadBoundList();           // 再加载已绑定列表
  }
});

const handleClose = () => {
  emit('update:modelValue', false);
};

const resetForm = () => {
  form.configId = null;
  form.isDefault = '1';
  formRef.value?.resetFields();
};

// 💡 1. 加载已绑定列表（做字段与层级兼容）
const loadBoundList = async () => {
  if (!props.appId) return;
  loading.value = true;
  try {
    const res: any = await listPayAppConfigRel({ appId: props.appId, pageNum: 1, pageSize: 100 } as any);
    const rawList = res.data?.rows || res.rows || [];

    boundList.value = rawList.map((relItem: any) => {
      const matchConfig = configOptions.value.find(
        (opt: any) => String(opt.configId) === String(relItem.configId)
      );

      // 兼容 boolean 型与 string 型的 isDefault
      const isDefaultStr = relItem.isDefault === true || relItem.isDefault === '1' ? '1' : '0';

      return {
        ...relItem,
        isDefault: isDefaultStr,
        configName: matchConfig?.configName || relItem.configName || '配置' + relItem.configId,
        channelType: matchConfig?.channelType || relItem.channelType || 'wxpay',
        mchId: matchConfig?.mchId || relItem.mchId || '-'
      };
    });
  } catch (error) {
    console.error('获取已绑定通道失败', error);
  } finally {
    loading.value = false;
  }
};

// 💡 2. 加载商户配置下拉列表
const loadConfigOptions = async () => {
  try {
    const res: any = await listPayConfig({ status: '0', pageNum: 1, pageSize: 100 } as any);
    configOptions.value = res.data?.rows || res.rows || [];
  } catch (error) {
    console.error('获取商户配置列表失败', error);
  }
};

// 💡 3. 新增绑定
const handleAddRel = () => {
  formRef.value?.validate(async (valid) => {
    if (!valid) return;
    
    submitLoading.value = true;
    try {
      const payload: any = {
        appId: props.appId,
        configId: form.configId,
        isDefault: form.isDefault === '1'
      };

      await addPayAppConfigRel(payload);
      ElMessage.success('绑定成功');
      resetForm();
      loadBoundList(); // 刷新已绑定列表
    } catch (error) {
      console.error('绑定失败', error);
    } finally {
      submitLoading.value = false;
    }
  });
};

// 💡 4. 设为默认通道
const handleSetDefault = async (row: any) => {
  try {
    await ElMessageBox.confirm(`确认将【${row.configName}】设为当前应用的默认支付通道吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });

    const payload: any = {
      id: row.id,
      appId: props.appId,
      configId: row.configId,
      isDefault: true // 传 true 给后端更新
    };

    await updatePayAppConfigRel(payload);
    ElMessage.success('已设为默认通道');
    loadBoundList(); // 重新加载列表，更新状态
  } catch (error) {
    if (error !== 'cancel') {
      console.error('设置默认失败', error);
    }
  }
};

// 💡 5. 解绑通道
const handleDelete = (id: number | string) => {
  ElMessageBox.confirm('确认解绑该支付通道吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await delPayAppConfigRel(id);
      ElMessage.success('解绑成功');
      loadBoundList();
    } catch (error) {
      console.error('解绑失败', error);
    }
  }).catch(() => {});
};
</script>