export type OrgType = 'Dimitra' | 'Cooperative' | 'Bank' | 'Farm'

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: OrgType
  organisation: string
  avatar: string
}
