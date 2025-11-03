import { verifyJWT, json } from '../../_utils'
export const onRequestPost = async (c) => {
  const auth = c.request.headers.get('authorization')?.replace('Bearer ','') || ''
  const user = await verifyJWT(auth, c.env)
  if(!user) return json(c, {error:'Unauthorized'}, 401)
  if(!user.perms?.includes('news:create')) return json(c, {error:'Forbidden'}, 403)
  const { title, body } = await c.request.json()
  if(!title || !body) return json(c, {error:'Faltan campos'}, 400)
  const id = crypto.randomUUID()
  await c.env.DB.prepare('INSERT INTO news (id,title,body,author_id,status) VALUES (?1,?2,?3,?4,?5)').bind(id, title, body, user.sub, 'draft').run()
  return json(c, {ok:true, id})
}