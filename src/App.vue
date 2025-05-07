<template>
  <n-config-provider>
    <n-space class="main-container" vertical :size="20">
      <n-h1>Управление учетными записями</n-h1>

      <n-alert type="info">
        Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;
        <template v-slot:icon> ? </template>
      </n-alert>

      <n-button type="primary" @click="addAccount" class="add-btn">
        Добавить учетную запись
      </n-button>

      <account-form
        v-for="(account, index) in accounts"
        :key="account.id"
        :account-data="account"
        :index="index"
        @remove="removeAccount"
      />
    </n-space>
  </n-config-provider>
</template>

<script lang="ts" setup>
import { NConfigProvider, NSpace, NH1, NButton, NAlert } from 'naive-ui'
import { useAccountsStore } from '@/stores/accounts'
import { storeToRefs } from 'pinia'
import AccountForm from '@/components/AccountForm.vue'

const accountsStore = useAccountsStore()
const { accounts } = storeToRefs(accountsStore)

const addAccount = () => {
  accountsStore.addAccount()
}

const removeAccount = (id: string) => {
  accountsStore.removeAccount(id)
}
</script>

<style scoped>
.add-btn {
  min-width: 250px;
}

.main-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
</style>
