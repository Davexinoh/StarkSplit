import { createClient } from '@supabase/supabase-js'

const URL = import.meta.env.VITE_SUPABASE_URL || ''
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = URL && KEY ? createClient(URL, KEY) : null

function db() {
  if (!supabase) throw new Error('Supabase not configured')
  return supabase
}

/* ── Auth ───────────────────────────────────────────────── */
export async function signUp({ email, password }) {
  const { data, error } = await db().auth.signUp({ email, password })
  if (error) throw error
  return data
}

export async function signIn({ email, password }) {
  const { data, error } = await db().auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  await db().auth.signOut()
}

export async function getSession() {
  const { data } = await db().auth.getSession()
  return data?.session ?? null
}

export async function resetPassword(email) {
  const { error } = await db().auth.resetPasswordForEmail(email, {
    redirectTo: `${import.meta.env.VITE_APP_URL || window.location.origin}/reset-password`,
  })
  if (error) throw error
}

/* ── Users ──────────────────────────────────────────────── */
export async function getUserByAuthId(authId) {
  const { data, error } = await db().from('users').select('*').eq('auth_id', authId).single()
  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function getUserByUsername(username) {
  const { data, error } = await db().from('users').select('*').eq('username', username.toLowerCase()).single()
  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function createUser({ username, walletAddress, authId }) {
  const { data, error } = await db().from('users')
    .insert({ username: username.toLowerCase(), wallet_address: walletAddress.toLowerCase(), auth_id: authId })
    .select().single()
  if (error) throw error
  return data
}

export async function isUsernameTaken(username) {
  const { data } = await db().from('users').select('id').eq('username', username.toLowerCase()).single()
  return Boolean(data)
}

/* ── Bills ──────────────────────────────────────────────── */
export async function createBill({ title, creatorId, totalAmount, splits }) {
  const { data: bill, error: billErr } = await db().from('bills')
    .insert({ title, creator_id: creatorId, total_amount: totalAmount, status: 'open' })
    .select().single()
  if (billErr) throw billErr
  const rows = splits.map(s => ({ bill_id: bill.id, username: s.username.toLowerCase(), amount: s.amount, paid: false }))
  const { error: splitErr } = await db().from('splits').insert(rows)
  if (splitErr) throw splitErr
  return bill
}

export async function getBill(billId) {
  const { data, error } = await db().from('bills').select('*, splits(*)').eq('id', billId).single()
  if (error) throw error
  return data
}

export async function getBillsByCreator(creatorId) {
  const { data, error } = await db().from('bills').select('*, splits(*)')
    .eq('creator_id', creatorId).order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function markSplitPaid({ splitId, txHash }) {
  const { error } = await db().from('splits')
    .update({ paid: true, tx_hash: txHash, paid_at: new Date().toISOString() })
    .eq('id', splitId)
  if (error) throw error
}

export async function getSplitByBillAndUsername({ billId, username }) {
  const { data, error } = await db().from('splits').select('*')
    .eq('bill_id', billId).eq('username', username.toLowerCase()).single()
  if (error && error.code !== 'PGRST116') throw error
  return data
      }
