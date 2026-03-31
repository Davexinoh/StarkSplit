import { useState, useCallback, useEffect } from 'react'
import {
  signUp, signIn, signOut, getSession,
  getUserByAuthId, createUser, isUsernameTaken
} from '../lib/supabase'

function mockAddr() {
  return '0x0' + Array.from({length:63},()=>Math.floor(Math.random()*16).toString(16)).join('')
}

export function useAuth() {
  const [session,   setSession]   = useState(null)
  const [user,      setUser]      = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error,     setError]     = useState(null)

  // Restore session on mount
  useEffect(() => {
    getSession().then(async (sess) => {
      setSession(sess)
      if (sess?.user) {
        const u = await getUserByAuthId(sess.user.id).catch(() => null)
        setUser(u)
      }
      setIsLoading(false)
    }).catch(() => setIsLoading(false))
  }, [])

  const register = useCallback(async ({ email, password, username }) => {
    setIsLoading(true)
    setError(null)
    try {
      const taken = await isUsernameTaken(username)
      if (taken) { setError('Username already taken'); return null }

      const { user: authUser } = await signUp({ email, password })
      if (!authUser) { setError('Signup failed'); return null }

      const addr = mockAddr()
      const u = await createUser({ username, walletAddress: addr, authId: authUser.id })
      setSession({ user: authUser })
      setUser(u)
      return u
    } catch (e) {
      setError(e?.message ?? 'Registration failed')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = useCallback(async ({ email, password }) => {
    setIsLoading(true)
    setError(null)
    try {
      const { user: authUser, session: sess } = await signIn({ email, password })
      setSession(sess)
      const u = await getUserByAuthId(authUser.id)
      setUser(u)
      return u
    } catch (e) {
      setError(e?.message ?? 'Login failed')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    await signOut().catch(() => {})
    setSession(null)
    setUser(null)
    setError(null)
  }, [])

  return {
    session,
    user,
    authId:      session?.user?.id ?? null,
    isLoggedIn:  Boolean(session),
    hasProfile:  Boolean(user),
    isLoading,
    error,
    register,
    login,
    logout,
    clearError:  () => setError(null),
  }
        }
        
