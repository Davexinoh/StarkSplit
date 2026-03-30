import { createClient } from '@supabase/supabase-js'

const URL = import.meta.env.VITE_SUPABASE_URL || ''
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Safe client — won't crash if env vars missing
export const supabase = URL && KEY
  ? createClient(URL, KEY)
  : null

function requireClient() {
  if (!supabase) throw new Error('Supabase not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.')
  return supabase
}

export async function getUserByAddress(address) {
  const { data, error } = await requireClient().from('users').select('*').eq('wallet_address', address.toLowerCase()).single()
  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function getUserByUsername(username) {
  const { data, error } = await requireClient().from('users').select('*').eq('username', username.toLowerCase()).single()
  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function createUser({ username, walletAddress }) {
  const { data, error } = await requireClient().from('users').insert({ username: username.toLowerCase(), wallet_address: walletAddress.toLowerCase() }).select().single()
  if (error) throw error
  return data
}

export async function isUsernameTaken(username) {
  const { data } = await requireClient().from('users').select('id').eq('username', username.toLowerCase()).single()
  return Boolean(data)
}

export async function createBill({ title, creatorId, totalAmount, splits }) {
  const { data: bill, error: billErr } = await requireClient().from('bills').insert({ title, creator_id: creatorId, total_amount: totalAmount, status: 'open' }).select().single()
  if (billErr) throw billErr
  const splitRows = splits.map(s => ({ bill_id: bill.id, username: s.username.toLowerCase(), amount: s.amount, paid: false }))
  const { error: splitErr } = await requireClient().from('splits').insert(splitRows)
  if (splitErr) throw splitErr
  return bill
}

export async function getBill(billId) {
  const { data, error } = await requireClient().from('bills').select('*, splits(*)').eq('id', billId).single()
  if (error) throw error
  return data
}

export async function getBillsByCreator(creatorId) {
  const { data, error } = await requireClient().from('bills').select('*, splits(*)').eq('creator_id', creatorId).order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function markSplitPaid({ splitId, txHash }) {
  const { error } = await requireClient().from('splits').update({ paid: true, tx_hash: txHash, paid_at: new Date().toISOString() }).eq('id', splitId)
  if (error) throw error
}

export async function getSplitByBillAndUsername({ billId, username }) {
  const { data, error } = await requireClient().from('splits').select('*').eq('bill_id', billId).eq('username', username.toLowerCase()).single()
  if (error && error.code !== 'PGRST116') throw error
  return data
}
