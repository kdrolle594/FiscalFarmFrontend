import { Pool, type QueryResult } from 'pg'

let pool: Pool | null = null

export function getPool(): Pool {
  if (pool) return pool
  const uri = process.env.DATABASE_URL
  if (!uri) throw new Error('DATABASE_URL not set')
  pool = new Pool({
    connectionString: uri,
    ssl: { rejectUnauthorized: false },
    max: 2,
    keepAlive: true,
  })
  return pool
}

// Convert MySQL-style `?` placeholders to Postgres `$1, $2, ...` so existing
// call sites can keep their query strings unchanged during the migration.
function toPg(sql: string): string {
  let i = 0
  return sql.replace(/\?/g, () => `$${++i}`)
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const result: QueryResult = await getPool().query(toPg(sql), params)
  return result.rows as T[]
}

export async function exec(sql: string, params: any[] = []): Promise<QueryResult> {
  return getPool().query(toPg(sql), params)
}
