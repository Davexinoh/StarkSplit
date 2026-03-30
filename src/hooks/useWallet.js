/**
 * hooks/useWallet.js
 * Cartridge Controller — Google/passkey login, no seed phrase.
 * Persists address in sessionStorage so page refresh keeps you logged in.
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import Controller from '@cartridge/controller'
import { STRK_TOKEN, RPC_URL } from '../lib/starkzap'

const controller = new Controller({
  chains: [{ rpcUrl: RPC_URL }],
  defaultChainId: '0x534e5f5345504f4c4941',
  policies: {
    contracts: {
      [STRK_TOKEN]: {
        name: 'STRK Token',
        methods: [
          { name: 'Transfer STRK', entrypoint: 'transfer' },
        ],
      },
    },
  },
})

export function useWallet() {
  const [address,   setAddress]   = useState(() => sessionStorage.getItem('ss_address') || null)
  const [isLoading, setIsLoading] = useState(false)
  const [error,     setError]     = useState(null)
  const accountRef                = useRef(null)

  // Restore controller session on mount
  useEffect(() => {
    const saved = sessionStorage.getItem('ss_address')
    if (saved && !accountRef.current) {
      controller.account().then(acc => {
        if (acc) {
          accountRef.current = acc
          setAddress(acc.address)
        }
      }).catch(() => {})
    }
  }, [])

  const login = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const account = await controller.connect()
      accountRef.current = account
      setAddress(account.address)
      sessionStorage.setItem('ss_address', account.address)
      return account
    } catch (err) {
      console.error('[useWallet]', err)
      setError(err?.message ?? 'Login failed')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try { await controller.disconnect() } catch {}
    accountRef.current = null
    setAddress(null)
    sessionStorage.removeItem('ss_address')
    setError(null)
  }, [])

  return {
    account:     accountRef.current,
    address,
    isConnected: Boolean(address),
    isLoading,
    error,
    login,
    logout,
  }
}
