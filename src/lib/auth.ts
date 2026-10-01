import { createHmac, timingSafeEqual } from 'node:crypto'
import { getCookie, setCookie } from '@tanstack/react-start/server'

const COOKIE = 'tt_session'

function token() {
  const secretToken = process.env.SESSION_SECRET
  if (!secretToken) throw new Error('SESSION_SECRET is not set')
  return createHmac('sha256', secretToken).update('tokis-take:v1').digest('hex')
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a),
    bb = Buffer.from(b)
  return ab.length === bb.length && timingSafeEqual(ab, bb)
}

export function checkPassword(input: string) {
  return safeEqual(input, process.env.SITE_PASSWORD!)
}

export function grantSession() {
  setCookie(COOKIE, token(), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
}

export function hasSession() {
  const value = getCookie(COOKIE)
  return !!value && safeEqual(value, token())
}
