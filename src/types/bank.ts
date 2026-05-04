export interface Bank {
  id: string
  title: string
  logo: string
  swiftCode: string
  contactFirstName: string
  contactLastName: string
  contactEmail: string
  contactPhone: string
  endpointUrl: string
  apiKey: string
  adminUsername: string
  adminPassword: string
  require2FA: boolean
}
