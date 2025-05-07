<template>
  <n-card :bordered="false" :content-style="{ padding: '0' }">
    <n-form ref="formRef" :model="account" :rules="rules" :show-label="false">
      <div class="form-grid" :class="{ 'ldap': account.type === AccountType.ldap }">
        <n-form-item
          path="labelsString"
          class="form-item"
          :show-feedback="hasErrors"
        >
          <n-input
            type="textarea"
            v-model:value="account.labelsString"
            placeholder="Введите метки"
            @blur="handleBlur"
            :autosize="{ minRows: 1, maxRows: 3 }"
          />
        </n-form-item>

        <n-form-item path="type" required class="form-item" :show-feedback="hasErrors">
          <n-select
            v-model:value="account.type"
            :options="typeOptions"
            @update:value="handleTypeChange"
          />
        </n-form-item>

        <n-form-item path="login" required class="form-item" :show-feedback="hasErrors">
          <n-input
            v-model:value="account.login"
            placeholder="Введите логин"
            @blur="handleBlur"
          />
        </n-form-item>

        <n-form-item
          v-if="account.type === AccountType.local"
          path="password"
          required
          class="form-item"
          :show-feedback="hasErrors"
        >
          <n-input
            v-model:value="account.password"
            type="password"
            placeholder="Введите пароль"
            show-password-on="click"
            @blur="handleBlur"
          />
        </n-form-item>

        <n-button type="error" @click="handleRemove">
          Удалить
        </n-button>
      </div>
    </n-form>
  </n-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useAccountsStore } from '@/stores/accounts'
import { NButton, NCard, NForm, NFormItem, NInput, NSelect } from 'naive-ui'
import { AccountType } from '@/types/account.ts'
import type { Account } from '@/types/account.ts'
import type { FormRules, FormInst } from 'naive-ui'

const props = defineProps<{
  accountData: Account
  index: number
}>()

const emit = defineEmits(['remove'])

const accountsStore = useAccountsStore()
const formRef = ref<FormInst | null>(null)
const hasErrors = ref(false)

const account = ref({
  id: props.accountData.id,
  labelsString: props.accountData.labels.map(l => l.text).join('; '),
  type: props.accountData.type,
  login: props.accountData.login,
  password: props.accountData.password || '',
})

const typeOptions = Object.values(AccountType).map(value => ({
  label: value,
  value: value,
}));

const rules: FormRules = {
  login: [
    { required: true, message: 'Логин обязателен', trigger: ['blur', 'input'] },
    { max: 100, message: 'Максимум 100 символов', trigger: ['blur', 'input'] }
  ],
  password: [
    {
      required: account.value.type === AccountType.local,
      message: 'Пароль обязателен',
      trigger: ['blur', 'input']
    },
    { max: 100, message: 'Максимум 100 символов', trigger: ['blur', 'input'] }
  ],
  labelsString: [
    { max: 50, message: 'Максимум 50 символов', trigger: ['blur', 'input'] }
  ]
}

const handleTypeChange = (value: AccountType) => {
  if (value === AccountType.ldap) {
    account.value.password = null
  } else if (value === AccountType.local && !account.value.password) {
    account.value.password = ''
  }
  validateAndSave()
}

const handleBlur = () => {
  validateAndSave()
}

const validateAndSave = async () => {
  try {
    hasErrors.value = false
    await formRef.value?.validate()
    const parsedLabels = accountsStore.parseLabels(account.value.labelsString)

    accountsStore.updateAccount({
      id: account.value.id,
      labels: parsedLabels,
      type: account.value.type,
      login: account.value.login,
      password: account.value.type === AccountType.local ? account.value.password : null,
    })
  } catch (e) {
    hasErrors.value = true
    console.log('Validation failed', e)
  }
}

const handleRemove = () => {
  emit('remove', account.value.id)
}
</script>

<style scoped>
.form-grid {
  display: grid;
  gap: 12px;
  width: 100%;
  align-items: start;
}

.form-grid {
  grid-template-columns:
    250px
    minmax(120px, 1fr)
    minmax(150px, 1fr)
    minmax(150px, 1fr)
    80px;
}

.ldap {
  grid-template-columns:
    250px
    minmax(120px, 1fr)
    minmax(312px, 1fr)
    80px;
}
</style>
