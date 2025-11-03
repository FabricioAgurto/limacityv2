import { verifyJWT, json } from '../../_utils'
export const onRequestPost = async (c) => {
  const auth = c.request.headers.get('authorization')?.replace('Bearer ','') || ''
  const user = await verifyJWT(auth, c.env)
  if(!user) return json(c, {error:'Unauthorized'}, 401)
  if(!user.perms?.includes('members:add')) return json(c, {error:'Forbidden'}, 403)
  const { display_name, role, user_id } = await c.request.json()
  if(!display_name || !role) return json(c, {error:'Faltan campos'}, 400)
  const id = crypto.randomUUID()
  await c.env.DB.prepare('INSERT INTO members (id,display_name,role,user_id) VALUES (?1,?2,?3,?4)').bind(id, display_name, role, user_id).run()
  return json(c, {ok:true, id})
}