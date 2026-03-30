/**
 * App.jsx
 * Root component.
 * Owns wallet + auth state, passes down to all pages.
 * Routes: / | /auth | /dashboard | /create | /bill/:id | /send
 */

import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Navbar        from './components/Navbar'
import Footer        from './components/Footer'
import LandingPage   from './pages/LandingPage'
import AuthPage      from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import CreateSplitPage from './pages/CreateSplitPage'
import BillPage      from './pages/BillPage'
import SendPage      from './pages/SendPage'
import { useWallet } from './hooks/useWallet'
import { useAuth   } from './hooks/useAuth'

/* ── Protected route ─────────────────────────────────────── */
function Protected({ children, address, user }) {
  if (!address) return <Navigate to="/auth" replace />
  if (!user)    return <Navigate to="/auth" replace />
  return children
}

export default function App() {
  const { account, address, balance, isConnected, login, logout, isLoading: walletLoading, error: walletError } = useWallet()
  const { user, hasProfile, isLoading: authLoading, error: authError, register } = useAuth(address)
  const navigate = useNavigate()

  // Auto-redirect after login + profile setup
  useEffect(() => {
    if (isConnected && hasProfile) {
      const path = window.location.hash.replace('#','')
      if (path === '/auth' || path === '' || path === '/') {
        navigate('/dashboard')
      }
    }
  }, [isConnected, hasProfile])

  // Handle login button from landing
  const handleLogin = async () => {
    const acc = await login()
    if (acc) navigate('/auth')
  }

  return (
    <>
      {/* ── Animated ambient background ── */}
      <div className="mesh-bg" aria-hidden="true"/>
      <div className="grid-bg" aria-hidden="true"/>

      {/* ── Navigation ── */}
      <Navbar
        address={address}
        user={user}
        onLogin={handleLogin}
        onLogout={logout}
        isLoading={walletLoading}
      />

      {/* ── Routes ── */}
      <Routes>
        <Route path="/" element={
          isConnected && hasProfile
            ? <Navigate to="/dashboard" replace />
            : <LandingPage onLogin={handleLogin} isLoading={walletLoading} />
        }/>

        <Route path="/auth" element={
          <AuthPage
            address={address}
            user={user}
            onLogin={handleLogin}
            isLoading={walletLoading}
            walletError={walletError}
            onRegister={register}
            authLoading={authLoading}
            authError={authError}
          />
        }/>

        <Route path="/dashboard" element={
          <Protected address={address} user={user}>
            <DashboardPage user={user} balance={balance} />
          </Protected>
        }/>

        <Route path="/create" element={
          <Protected address={address} user={user}>
            <CreateSplitPage user={user} />
          </Protected>
        }/>

        <Route path="/bill/:id" element={
          <BillPage
            user={user}
            account={account}
            onLogin={handleLogin}
            isLoading={walletLoading}
          />
        }/>

        <Route path="/send" element={
          <Protected address={address} user={user}>
            <SendPage user={user} account={account} />
          </Protected>
        }/>

        <Route path="*" element={
          <div style={{ minHeight:'80vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16, textAlign:'center' }}>
            <h2 style={{ fontSize:'1.5rem' }}>404 — Page not found</h2>
            <button className="btn btn-primary" onClick={() => navigate('/')} style={{ padding:'12px 28px' }}>
              Go home
            </button>
          </div>
        }/>
      </Routes>

      {/* ── Footer ── */}
      <Footer />
    </>
  )
          }
