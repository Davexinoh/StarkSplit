import { useState, useCallback, useRef } from 'react'

const MOCK_BALANCE = 10000

function mockAddr() {
  return '0x0' + Array.from({length:63},()=>Math.floor(Math.random()*16).toString(16)).join('')
}
function mockHash() {
  return '0x' + Array.from({length:64},()=>Math.floor(Math.random()*16).toString(16)).join('')
}

export function useWallet() {
  const [address,   setAddress]   = useState(() => sessionStorage.getItem('ss_address') || null)
  const [balance,   setBalance]   = useState(() => parseFloat(sessionStorage.getItem('ss_balance') || MOCK_BALANCE))
  const [isLoading, setIsLoading] = useState(false)
  const [error,     setError]     = useState(null)
  const accountRef                = useRef(null)

  const login = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      await new Promise(r => setTimeout(r, 1400))
      const addr = mockAddr()
      const account = {
        address: addr,
        balance: MOCK_BALANCE,
        async execute(calls) {
          await new Promise(r => setTimeout(r, 2000))
          return { transaction_hash: mockHash() }
        }
      }
      accountRef.current = account
      setAddress(addr)
      setBalance(MOCK_BALANCE)
      sessionStorage.setItem('ss_address', addr)
      sessionStorage.setItem('ss_balance', String(MOCK_BALANCE))
      return account
    } catch(e) {
      setError(e?.message ?? 'Login failed')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deductBalance = useCallback((amount) => {
    setBalance(prev => {
      const next = Math.max(0, prev - parseFloat(amount))
      sessionStorage.setItem('ss_balance', String(next))
      if (accountRef.current) accountRef.current.balance = next
      return next
    })
  }, [])

  const logout = useCallback(() => {
    accountRef.current = null
    setAddress(null)
    setBalance(MOCK_BALANCE)
    sessionStorage.removeItem('ss_address')
    sessionStorage.removeItem('ss_balance')
  }, [])

  return {
    account:     accountRef.current,
    address,
    balance,
    isConnected: Boolean(address),
    isLoading,
    error,
    login,
    logout,
    deductBalance,
  }
        }
    
