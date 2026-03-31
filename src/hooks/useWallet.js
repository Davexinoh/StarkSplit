/**
 * hooks/useWallet.js
 * Wallet is now derived from the auth session.
 * Address is stored in Supabase users table — persistent across logins.
 * Mock account for tx execution during demo.
 */
import { useState, useCallback, useRef, useEffect } from 'react'

function mockHash() {
  return '0x' + Array.from({length:64},()=>Math.floor(Math.random()*16).toString(16)).join('')
}

export function useWallet(user) {
  const [balance,   setBalance]   = useState(10000)
  const [isLoading, setIsLoading] = useState(false)
  const accountRef                = useRef(null)

  useEffect(() => {
    if (user?.wallet_address) {
      accountRef.current = {
        address: user.wallet_address,
        balance: 10000,
        async execute() {
          await new Promise(r => setTimeout(r, 2000))
          return { transaction_hash: mockHash() }
        }
      }
    } else {
      accountRef.current = null
    }
  }, [user])

  const deductBalance = useCallback((amount) => {
    setBalance(prev => Math.max(0, prev - parseFloat(amount)))
  }, [])

  return {
    account:  accountRef.current,
    address:  user?.wallet_address ?? null,
    balance,
    isLoading,
    deductBalance,
  }
}
