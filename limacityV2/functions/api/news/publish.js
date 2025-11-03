import { verifyJWT, json } from '../../_utils'
export const onRequestPut = async (c) => {
  const auth = c.request.headers.get('authorization')?.replace('Bearer ','') || ''
  const user = await verifyJWT(auth, c.env)
  if(!user) return json(c, {error:'Unauthorized'}, 401)
  if(!user.perms?.includes('news:publish')) return json(c, {error:'Forbidden'}, 403)
  const { id } = await c.request.json()
  if(!id) return json(c, {error:'Falta id'}, 400)
  await c.env.DB.prepare('UPDATE news SET status="published" WHERE id=?1').bind(id).run()
  return json(c, {ok:true})
}