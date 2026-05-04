import type { OrgType } from './auth'

export interface NavItem {
  title: string
  icon: string
  to?: string
  allowedOrgTypes: OrgType[]
  children?: NavItem[]
}

export interface NavSection {
  title?: string
  items: NavItem[]
}
