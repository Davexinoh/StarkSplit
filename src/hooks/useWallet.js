import { useState, useCallback, useRef, useEffect } from 'react'
import { supabase } from '../lib/supabase'

function mockHash() {
  return '0x' + Array.from({length:64},()=>Math.floor(Math.random()*16).toString(16)).join('')
}

export function useWallet(user) {
  const [balance, setBalance] = useState(10000)
  const accountRef = useRef(null)

  // Load balance from Supabase when user changes
  useEffect(() => {
    if (!user?.id) { setBalance(10000); accountRef.current = null; return }

    // Load saved balance
    const saved = user.balance ?? 10000
    setBalance(saved)

    accountRef.current = {
      address: user.wallet_address,
      async execute() {
        await new Promise(r => setTimeout(r, 2000))
        return { transaction_hash: mockHash() }
      }
    }
  }, [user?.id])

  // Deduct from sender's balance in Supabase
  const deductBalance = useCallback(async (amount) => {
    if (!user?.id || !supabase) return
    const next = Math.max(0, (user.balance ?? 10000) - parseFloat(amount))
    setBalance(next)
    await supabase.from('users').update({ balance: next }).eq('id', user.id)
  }, [user?.id, user?.balance])

  // Add to recipient's balance in Supabase
  const addBalance = useCallback(async (toUsername, amount) => {
    if (!supabase) return
    try {
      const { data: recipient } = await supabase
        .from('users').select('id, balance').eq('username', toUsername.toLowerCase()).single()
      if (!recipient) return
      const next = (recipient.balance ?? 10000) + parseFloat(amount)
      await supabase.from('users').update({ balance: next }).eq('id', recipient.id)
    } catch (e) {
      console.error('[addBalance]', e)
    }
  }, [])

  return {
    account:  accountRef.current,
    address:  user?.wallet_address ?? null,
    balance,
    deductBalance,
    addBalance,
  }
}
