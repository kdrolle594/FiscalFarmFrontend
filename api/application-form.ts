import { query } from './_lib/db'
import { methods, withAuth } from './_lib/handler'

interface FieldRow {
  id: string
  parent_id: string | null
  label: string
  type: string
  mandatory: number | boolean
  subdata: any
  sort_order: number
}

export default methods({
  GET: withAuth(async (_req, res) => {
    const rows = await query<FieldRow>(
      'SELECT id, parent_id, label, type, mandatory, subdata, sort_order FROM application_form_fields ORDER BY sort_order',
    )
    const byId = new Map<string, any>()
    const roots: any[] = []
    for (const r of rows) {
      const subdata = r.subdata == null ? undefined :
        (typeof r.subdata === 'string' ? JSON.parse(r.subdata) : r.subdata)
      const node: any = {
        id: r.id,
        label: r.label,
        type: r.type,
        mandatory: !!r.mandatory,
        ...(subdata ? { subdata } : {}),
      }
      byId.set(r.id, node)
    }
    for (const r of rows) {
      const node = byId.get(r.id)
      if (r.parent_id) {
        const parent = byId.get(r.parent_id)
        if (parent) {
          parent.children = parent.children || []
          parent.children.push(node)
        }
      } else {
        roots.push(node)
      }
    }
    res.status(200).json(roots)
  }),
})
