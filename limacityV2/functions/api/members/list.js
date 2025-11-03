import { json } from '../../_utils'
export const onRequestGet = async (c) => {
  const res = await c.env.DB.prepare('SELECT id,display_name,role,created_at,user_id,(SELECT email FROM users u WHERE u.id = user_id) as email FROM members ORDER BY created_at DESC').all()
  return json(c, {items: res.results||[]})
}