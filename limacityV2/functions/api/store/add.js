import { verifyJWT, json } from '../../_utils'
export const onRequestPost = async (c) => {
  const auth = c.request.headers.get('authorization')?.replace('Bearer ','') || ''
  const user = await verifyJWT(auth, c.env)
  if(!user) return json(c, {error:'Unauthorized'}, 401)
  if(!user.perms?.includes('store:add')) return json(c, {error:'Forbidden'}, 403)
  const { name, description, category, price_soles } = await c.request.json()
  if(!name) return json(c, {error:'Falta nombre'}, 400)
  const id = crypto.randomUUID()
  await c.env.DB.prepare('INSERT INTO store_items (id,name,description,category,price_soles) VALUES (?1,?2,?3,?4,?5)').bind(id, name, description||'', category||'General', price_soles || 0).run()
  return json(c, {ok:true, id})
}