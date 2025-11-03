import { verifyJWT, json } from '../../_utils'
export const onRequestGet = async (c) => {
  const auth = c.request.headers.get('authorization')?.replace('Bearer ','') || ''
  const user = await verifyJWT(auth, c.env)
  if(!user) return json(c, {error:'Unauthorized'}, 401)
  const res = await c.env.DB.prepare('SELECT id,title,status,created_at FROM news WHERE author_id=?1 ORDER BY created_at DESC').bind(user.sub).all()
  return json(c, {items: res.results||[]})
}