import { verifyJWT, json } from '../../_utils'
export const onRequestPost = async (c) => {
  const auth = c.request.headers.get('authorization')?.replace('Bearer ','') || ''
  const user = await verifyJWT(auth, c.env)
  if(!user) return json(c, {error:'Inicia sesión para comprar'}, 401)
  const { id } = await c.request.json()
  if(!id) return json(c, {error:'Falta id de producto'}, 400)
  const item = await c.env.DB.prepare('SELECT id FROM store_items WHERE id=?1').bind(id).first()
  if(!item) return json(c, {error:'Producto no existe'}, 404)
  const pid = crypto.randomUUID()
  await c.env.DB.prepare('INSERT INTO purchases (id,user_id,item_id) VALUES (?1,?2,?3)').bind(pid, user.sub, id).run()
  return json(c, {ok:true, purchase_id: pid})
}