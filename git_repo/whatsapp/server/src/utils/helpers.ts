import { v4 as uuidv4 } from "uuid"

export function generateId(): string {
  return uuidv4()
}

export function paginate(page: number, limit: number) {
  const offset = (page - 1) * limit
  return { offset, limit }
}

export function buildSearchClause(search: string, fields: string[]): { clause: string; params: string[] } {
  if (!search) return { clause: "", params: [] }
  const conditions = fields.map((f) => `${f} LIKE ?`)
  const params = fields.map(() => `%${search}%`)
  return { clause: `AND (${conditions.join(" OR ")})`, params }
}

export function now(): string {
  return new Date().toISOString().replace("T", " ").substring(0, 19)
}
