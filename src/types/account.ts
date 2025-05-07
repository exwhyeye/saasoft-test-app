export enum AccountType {
  local = 'Локальная',
  ldap = 'LDAP',
}

export interface AccountLabel {
  text: string
}

export interface Account {
  id: string
  labels: AccountLabel[]
  type: AccountType
  login: string
  password: string | null
}
