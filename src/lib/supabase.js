/**
 * lib/supabase.js
 * Single source of truth for Supabase client.
 * Never import from @supabase/supabase-js directly elsewhere.
 *
 * Tables:
 *   users:  id, username, wallet_address, google_id, created_at
 *   bills:  id, title, creator_id, total_amount, status, created_at
 *   splits: id, bill_id, username, amount, paid, tx_hash, paid_at
 */

import { createClient } from '@supabase/supabase-js'

const URL = import.meta.env.VITE_SUPABASE_URL
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!URL || !KEY) {
  console.warn('[StarkSplit] Supabase env vars missing. Check .env file.')
}

export const supabase = createClient(URL, KEY)

/* ── User helpers ────────────────────────────────────────── */

export async function getUserByAddress(address) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('wallet_address', address.toLowerCase())
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function getUserByUsername(username) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username.toLowerCase())
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function createUser({ username, walletAddress }) {
  const { data, error } = await supabase
    .from('users')
    .insert({ username: username.toLowerCase(), wallet_address: walletAddress.toLowerCase() })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function isUsernameTaken(username) {
  const { data } = await supabase
    .from('users')
    .select('id')
    .eq('username', username.toLowerCase())
    .single()
  return Boolean(data)
}

/* ── Bill helpers ────────────────────────────────────────── */

export async function createBill({ title, creatorId, totalAmount, splits }) {
  // Insert bill
  const { data: bill, error: billErr } = await supabase
    .from('bills')
    .insert({ title, creator_id: creatorId, total_amount: totalAmount, status: 'open' })
    .select()
    .single()
  if (billErr) throw billErr

  // Insert splits
  const splitRows = splits.map(s => ({
    bill_id:  bill.id,
    username: s.username.toLowerCase(),
    amount:   s.amount,
    paid:     false,
  }))

  const { error: splitErr } = await supabase
    .from('splits')
    .insert(splitRows)
  if (splitErr) throw splitErr

  return bill
}

export async function getBill(billId) {
  const { data, error } = await supabase
    .from('bills')
    .select('*, splits(*)')
    .eq('id', billId)
    .single()
  if (error) throw error
  return data
}

export async function getBillsByCreator(creatorId) {
  const { data, error } = await supabase
    .from('bills')
    .select('*, splits(*)')
    .eq('creator_id', creatorId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function markSplitPaid({ splitId, txHash }) {
  const { error } = await supabase
    .from('splits')
    .update({ paid: true, tx_hash: txHash, paid_at: new Date().toISOString() })
    .eq('id', splitId)
  if (error) throw error
}

export async function getSplitByBillAndUsername({ billId, username }) {
  const { data, error } = await supabase
    .from('splits')
    .select('*')
    .eq('bill_id', billId)
    .eq('username', username.toLowerCase())
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data
}
