import { hashPassword, json } from '../../_utils'
export const onRequestPost = async (c) => {
  const { email, password } = await c.request.json()
  if(!email || !password) return json(c, {error:'Email y contraseña requeridos'}, 400)
  const exists = await c.env.DB.prepare('SELECT id FROM users WHERE email=?1').bind(email).first()
  if (exists) return json(c, {error:'Email ya registrado'}, 400)
  const id = crypto.randomUUID()
  const hashed = await hashPassword(password)
  await c.env.DB.prepare('INSERT INTO users (id,email,password_hash) VALUES (?1,?2,?3)').bind(id, email, hashed).run()
  await c.env.DB.prepare('INSERT INTO user_roles (id,user_id,role_id) VALUES (?1,?2,?3)').bind(crypto.randomUUID(), id, 'r-writer').run()
  return json(c, {ok:true})
}