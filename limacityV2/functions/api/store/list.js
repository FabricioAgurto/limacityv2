import { json } from '../../_utils'
export const onRequestGet = async (c) => {
  const res = await c.env.DB.prepare('SELECT id,name,description,category,price_soles,created_at FROM store_items ORDER BY created_at DESC').all()
  return json(c, {items: res.results||[]})
}