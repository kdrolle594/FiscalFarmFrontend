import fs from 'node:fs'
import path from 'node:path'
import mysql from 'mysql2/promise'

let pool: mysql.Pool | null = null

function getSslConfig() {
  if (process.env.AIVEN_CA_CERT) return { ca: process.env.AIVEN_CA_CERT }
  // Vercel bundles ca.pem at function root via vercel.json includeFiles.
  const candidates = [path.resolve(process.cwd(), 'ca.pem'), path.resolve(__dirname, '..', '..', 'ca.pem')]
  for (const p of candidates) {
    if (fs.existsSync(p)) return { ca: fs.readFileSync(p, 'utf-8') }
  }
  return { rejectUnauthorized: true }
}

export function getPool(): mysql.Pool {
  if (pool) return pool
  const uri = process.env.AIVEN_MYSQL_URI
  if (!uri) throw new Error('AIVEN_MYSQL_URI not set')
  pool = mysql.createPool({
    uri,
    ssl: getSslConfig(),
    connectionLimit: 2,
    waitForConnections: true,
    enableKeepAlive: true,
  })
  return pool
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const [rows] = await getPool().execute(sql, params)
  return rows as T[]
}

export async function exec(sql: string, params: any[] = []): Promise<mysql.ResultSetHeader> {
  const [result] = await getPool().execute(sql, params)
  return result as mysql.ResultSetHeader
}
