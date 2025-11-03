import { verifyPassword, signJWT, getUserRolesAndPerms, json } from '../../_utils'
export const onRequestPost = async (c) => {
  const { email, password } = await c.request.json()
  const row = await c.env.DB.prepare('SELECT id,email,password_hash FROM users WHERE email=?1').bind(email).first()
  if(!row) return json(c, {error:'Credenciales inválidas'}, 401)
  const ok = await verifyPassword(password, row.password_hash)
  if(!ok) return json(c, {error:'Credenciales inválidas'}, 401)
  const { roleNames, permKeys } = await getUserRolesAndPerms(c.env.DB, row.id)
  const token = await signJWT({ sub: row.id, email: row.email, roles: roleNames, perms: permKeys }, c.env, 900)
  return json(c, { ok:true, token, user:{ id: row.id, email: row.email, roles: roleNames, perms: permKeys } })
}