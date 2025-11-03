import { json } from '../../_utils'
export const onRequestGet = async (c) => {
  const res = await c.env.DB.prepare('SELECT id,title,body,created_at FROM news WHERE status="published" ORDER BY created_at DESC LIMIT 30').all()
  return json(c, {items: res.results||[]})
}