/**
 * hooks/useAuth.js
 * Manages the StarkSplit user profile (username + wallet address).
 * Stored in Supabase, keyed by wallet address.
 */

import { useState, useCallback, useEffect } from 'react'
import { getUserByAddress, createUser, isUsernameTaken } from '../lib/supabase'

export function useAuth(address) {
  const [user,      setUser]      = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error,     setError]     = useState(null)

  // Load user whenever address changes
  useEffect(() => {
    if (!address) { setUser(null); return }
    setIsLoading(true)
    getUserByAddress(address)
      .then(u => setUser(u))
      .catch(e => console.error('[useAuth] load:', e))
      .finally(() => setIsLoading(false))
  }, [address])

  const register = useCallback(async (username) => {
    if (!address) return null
    setIsLoading(true)
    setError(null)
    try {
      const taken = await isUsernameTaken(username)
      if (taken) { setError('Username already taken'); return null }
      const u = await createUser({ username, walletAddress: address })
      setUser(u)
      return u
    } catch (err) {
      setError(err?.message ?? 'Registration failed')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [address])

  return {
    user,
    hasProfile:  Boolean(user),
    isLoading,
    error,
    register,
  }
}
