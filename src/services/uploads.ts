import { api } from './api'

export type UploadKind = 'avatar' | 'bank-logo' | 'loan-program-logo'

export interface UploadResult {
  path: string
  publicUrl: string
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      const comma = result.indexOf(',')
      resolve(comma >= 0 ? result.slice(comma + 1) : result)
    }
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

export async function uploadImage(file: File, kind: UploadKind): Promise<UploadResult> {
  const dataBase64 = await fileToBase64(file)
  return api.post<UploadResult>('/api/uploads', {
    kind,
    contentType: file.type,
    dataBase64,
  })
}
