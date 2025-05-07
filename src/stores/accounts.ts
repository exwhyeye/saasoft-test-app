import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AccountType } from '@/types/account.ts'
import type { AccountLabel, Account } from '@/types/account.ts'

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([])

  /**
   * Добавить новую запись
   */
  const addAccount = () => {
    accounts.value.push({
      id: Date.now().toString(),
      labels: [],
      type: AccountType.local,
      login: '',
      password: '',
    })
  }

  /**
   * Удалить запись по id записи
   * @param {string} id - id записи
   */
  const removeAccount = (id: string) => {
    accounts.value = accounts.value.filter((account: Account) => account.id !== id)
  }

  /**
   * Обновить запись
   * @param {Account} updatedAccount - измененная запись
   */
  const updateAccount = (updatedAccount: Account) => {
    const index = accounts.value.findIndex((a: Account) => a.id === updatedAccount.id)
    if (index !== -1) {
      accounts.value[index] = updatedAccount
    }

    console.log("id:", updatedAccount.id)
    console.log("labels:", updatedAccount.labels)
    console.log("type:", updatedAccount.type)
    console.log("login:", updatedAccount.login)
    console.log("password:", updatedAccount.password)
  }

  /**
   * Преобразует строку с метками в массив объектов AccountLabel
   *
   * Разделяет входную строку по символу ';' и преобразует в объекты вида { text: string }
   *
   * @param {string} labelsString - Строка меток, разделенных точкой с запятой
   * @returns {AccountLabel[]} Массив объектов меток
   */
  const parseLabels = (labelsString: string): AccountLabel[] => {
    if (!labelsString.trim()) return []
    return labelsString.split(';')
      .map(label => label.trim())
      .filter(label => label.length > 0)
      .map(label => ({ text: label }))
  }

  return {
    accounts,
    addAccount,
    removeAccount,
    updateAccount,
    parseLabels
  }
}, {
  persist: true
})
