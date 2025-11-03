import { verifyJWT, json } from '../../_utils'
export const onRequestGet = async (c) => {
  const auth = c.request.headers.get('authorization')?.replace('Bearer ','') || ''
  if(!auth) return json(c, {user:null})
  const payload = await verifyJWT(auth, c.env)
  if(!payload) return json(c, {user:null})
  return json(c, {user: payload})
}