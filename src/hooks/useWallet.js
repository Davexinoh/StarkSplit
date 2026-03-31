import { useState, useCallback, useRef, useEffect } from 'react'

const INITIAL_BALANCE = 10000

function mockHash() {
  return '0x' + Array.from({length:64},()=>Math.floor(Math.random()*16).toString(16)).join('')
}

export function useWallet(user) {
  const [balance, setBalance] = useState(() => {
    if (!user?.id) return INITIAL_BALANCE
    const saved = localStorage.getItem(`balance_${user?.id}`)
    return saved ? parseFloat(saved) : INITIAL_BALANCE
  })
  const accountRef = useRef(null)

  // Rebuild account whenever user changes
  useEffect(() => {
    if (user?.wallet_address) {
      accountRef.current = {
        address: user.wallet_address,
        async execute() {
          await new Promise(r => setTimeout(r, 2000))
          return { transaction_hash: mockHash() }
        }
      }
      // Load saved balance for this user
      const saved = localStorage.getItem(`balance_${user.id}`)
      setBalance(saved ? parseFloat(saved) : INITIAL_BALANCE)
    } else {
      accountRef.current = null
      setBalance(INITIAL_BALANCE)
    }
  }, [user?.id])

  const deductBalance = useCallback((amount) => {
    if (!user?.id) return
    setBalance(prev => {
      const next = Math.max(0, prev - parseFloat(amount))
      localStorage.setItem(`balance_${user.id}`, String(next))
      return next
    })
  }, [user?.id])

  return {
    account:  accountRef.current,
    address:  user?.wallet_address ?? null,
    balance,
    deductBalance,
  }
}
