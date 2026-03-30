import { useState, useCallback, useRef } from 'react'

function mockAddr() {
  return '0x0' + Array.from({length:63},()=>Math.floor(Math.random()*16).toString(16)).join('')
}
function mockHash() {
  return '0x' + Array.from({length:64},()=>Math.floor(Math.random()*16).toString(16)).join('')
}

export function useWallet() {
  const [address, setAddress] = useState(() => sessionStorage.getItem('ss_address') || null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const accountRef = useRef(null)

  const login = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      await new Promise(r => setTimeout(r, 1400))
      const addr = mockAddr()
      const account = {
        address: addr,
        async execute() {
          await new Promise(r => setTimeout(r, 2000))
          return { transaction_hash: mockHash() }
        }
      }
      accountRef.current = account
      setAddress(addr)
      sessionStorage.setItem('ss_address', addr)
      return account
    } catch(e) {
      setError(e?.message ?? 'Login failed')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    accountRef.current = null
    setAddress(null)
    sessionStorage.removeItem('ss_address')
  }, [])

  return { account: accountRef.current, address, isConnected: Boolean(address), isLoading, error, login, logout }
}
