import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Navbar          from './components/Navbar'
import Footer          from './components/Footer'
import LandingPage     from './pages/LandingPage'
import AuthPage        from './pages/AuthPage'
import DashboardPage   from './pages/DashboardPage'
import CreateSplitPage from './pages/CreateSplitPage'
import BillPage        from './pages/BillPage'
import SendPage        from './pages/SendPage'
import { useAuth }     from './hooks/useAuth'
import { useWallet }   from './hooks/useWallet'

function Protected({ children, isLoggedIn, hasProfile }) {
  if (!isLoggedIn || !hasProfile) return <Navigate to="/auth" replace />
  return children
}

export default function App() {
  const {
    session, user, isLoggedIn, hasProfile,
    isLoading, error, register, login, logout, clearError,
  } = useAuth()

  const { account, address, balance, deductBalance } = useWallet(user)
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoggedIn && hasProfile) {
      const hash = window.location.hash.replace('#','')
      if (!hash || hash === '/' || hash === '/auth') navigate('/dashboard')
    }
  }, [isLoggedIn, hasProfile])

  const goToAuth = () => navigate('/auth')

  return (
    <>
      <div className="mesh-bg" aria-hidden="true"/>
      <div className="grid-bg"  aria-hidden="true"/>

      <Navbar
        user={user}
        address={address}
        isLoggedIn={isLoggedIn}
        onLogin={goToAuth}
        onLogout={logout}
        isLoading={isLoading}
      />

      <Routes>
        <Route path="/" element={
          isLoggedIn && hasProfile
            ? <Navigate to="/dashboard" replace />
            : <LandingPage onLogin={goToAuth} isLoading={isLoading} />
        }/>

        <Route path="/auth" element={
          <AuthPage
            isLoggedIn={isLoggedIn}
            hasProfile={hasProfile}
            isLoading={isLoading}
            error={error}
            onRegister={register}
            onLogin={login}
            onClearError={clearError}
          />
        }/>

        <Route path="/dashboard" element={
          <Protected isLoggedIn={isLoggedIn} hasProfile={hasProfile}>
            <DashboardPage user={user} balance={balance} />
          </Protected>
        }/>

        <Route path="/create" element={
          <Protected isLoggedIn={isLoggedIn} hasProfile={hasProfile}>
            <CreateSplitPage user={user} />
          </Protected>
        }/>

        <Route path="/bill/:id" element={
          <BillPage
            user={user}
            account={account}
            onLogin={goToAuth}
            isLoading={isLoading}
            onDeduct={deductBalance}
          />
        }/>

        <Route path="/send" element={
          <Protected isLoggedIn={isLoggedIn} hasProfile={hasProfile}>
            <SendPage user={user} account={account} onDeduct={deductBalance} />
          </Protected>
        }/>

        <Route path="*" element={
          <div style={{ minHeight:'80vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16, textAlign:'center', zIndex:1, position:'relative' }}>
            <h2 style={{ fontSize:'1.5rem' }}>404 — Not found</h2>
            <button className="btn btn-primary" onClick={() => navigate('/')} style={{ padding:'12px 28px' }}>
              Go home
            </button>
          </div>
        }/>
      </Routes>

      <Footer />
    </>
  )
}
