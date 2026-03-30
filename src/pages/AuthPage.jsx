import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { isValidUsername } from '../lib/utils'

export default function AuthPage({ address, user, onLogin, isLoading, walletError, onRegister, authLoading, authError }) {
  const navigate = useNavigate()
  const [mode, setMode] = useState('choose') // 'choose' | 'signup' | 'signin'
  const [username, setUsername] = useState('')
  const [usernameErr, setUsernameErr] = useState('')

  useEffect(() => {
    if (address && user) navigate('/dashboard')
  }, [address, user, navigate])

  const handleRegister = async () => {
    if (!isValidUsername(username)) {
      setUsernameErr('3–20 chars, letters/numbers/underscore only')
      return
    }
    setUsernameErr('')
    const result = await onRegister(username)
    if (result) navigate('/dashboard')
  }

  return (
    <div style={{
      minHeight:      '100dvh',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      padding:        '40px 20px',
      position:       'relative',
      zIndex:         1,
    }}>
      {/* Big ambient glow behind card */}
      <div style={{
        position:      'absolute',
        top:           '40%', left: '50%',
        transform:     'translate(-50%,-50%)',
        width:         500, height: 500,
        borderRadius:  '50%',
        background:    'radial-gradient(circle,rgba(255,77,0,0.10) 0%,transparent 70%)',
        pointerEvents: 'none',
      }}/>

      <motion.div
        initial={{ opacity:0, y:24 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:0.55, ease:[0.16,1,0.3,1] }}
        style={{ width:'100%', maxWidth:440 }}
      >

        {/* ── STEP 1: Not connected ── */}
        {!address && (
          <AnimatePresence mode="wait">

            {/* Choose mode */}
            {mode === 'choose' && (
              <motion.div
                key="choose"
                initial={{ opacity:0, scale:0.95 }}
                animate={{ opacity:1, scale:1 }}
                exit={{ opacity:0, scale:0.95 }}
                transition={{ duration:0.35 }}
                className="card card-glow"
                style={{ padding:'44px 32px', textAlign:'center' }}
              >
                <div style={{
                  width:64, height:64,
                  borderRadius:'var(--r-lg)',
                  background:'linear-gradient(135deg,var(--orange),var(--amber))',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  margin:'0 auto 24px',
                  boxShadow:'var(--shadow-btn)',
                  fontSize:'1.8rem',
                }}>
                  ⚡
                </div>
                <h2 style={{ fontSize:'1.7rem', marginBottom:10 }}>StarkSplit</h2>
                <p style={{ marginBottom:32, fontSize:'0.9rem' }}>
                  Split bills with anyone, anywhere. No wallet. No fees.
                </p>

                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => setMode('signup')}
                    style={{ width:'100%', padding:'16px', fontSize:'1rem' }}
                  >
                    🚀 Create account
                  </button>
                  <button
                    className="btn btn-ghost"
                    onClick={() => setMode('signin')}
                    style={{ width:'100%', padding:'16px', fontSize:'1rem' }}
                  >
                    Sign in
                  </button>
                </div>

                <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:12, marginTop:20 }}>
                  {['No wallet needed','Free to use','Starknet L2'].map((t,i) => (
                    <React.Fragment key={t}>
                      {i > 0 && <span style={{ color:'var(--border-3)', fontSize:'0.6rem' }}>·</span>}
                      <span style={{ fontSize:'0.68rem', color:'var(--text-500)' }}>{t}</span>
                    </React.Fragment>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Sign up */}
            {mode === 'signup' && (
              <motion.div
                key="signup"
                initial={{ opacity:0, x:20 }}
                animate={{ opacity:1, x:0 }}
                exit={{ opacity:0, x:-20 }}
                transition={{ duration:0.35 }}
                className="card card-glow"
                style={{ padding:'44px 32px' }}
              >
                <button onClick={() => setMode('choose')} style={{ background:'none', color:'var(--text-400)', fontSize:'0.82rem', cursor:'pointer', marginBottom:20, display:'flex', alignItems:'center', gap:6 }}>
                  ← Back
                </button>
                <h2 style={{ fontSize:'1.5rem', marginBottom:8 }}>Create account</h2>
                <p style={{ marginBottom:28, fontSize:'0.88rem' }}>
                  Sign in with Google — your Starknet wallet is auto-created. You start with 10,000 testnet STRK.
                </p>

                {walletError && (
                  <div style={{ background:'var(--red-glow)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'var(--r-md)', padding:'11px 15px', marginBottom:16, fontSize:'0.83rem', color:'var(--red)' }}>
                    ⚠ {walletError}
                  </div>
                )}

                <button
                  className="btn btn-primary"
                  onClick={onLogin}
                  disabled={isLoading}
                  style={{ width:'100%', padding:'16px', fontSize:'1rem', marginBottom:16 }}
                >
                  {isLoading
                    ? <><span className="spinner"/> Connecting…</>
                    : <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continue with Google
                      </>
                  }
                </button>

                <p style={{ textAlign:'center', fontSize:'0.72rem', color:'var(--text-500)' }}>
                  Already have an account?{' '}
                  <button onClick={() => setMode('signin')} style={{ background:'none', color:'var(--orange-2)', cursor:'pointer', fontSize:'0.72rem' }}>
                    Sign in
                  </button>
                </p>
              </motion.div>
            )}

            {/* Sign in */}
            {mode === 'signin' && (
              <motion.div
                key="signin"
                initial={{ opacity:0, x:20 }}
                animate={{ opacity:1, x:0 }}
                exit={{ opacity:0, x:-20 }}
                transition={{ duration:0.35 }}
                className="card card-glow"
                style={{ padding:'44px 32px' }}
              >
                <button onClick={() => setMode('choose')} style={{ background:'none', color:'var(--text-400)', fontSize:'0.82rem', cursor:'pointer', marginBottom:20, display:'flex', alignItems:'center', gap:6 }}>
                  ← Back
                </button>
                <h2 style={{ fontSize:'1.5rem', marginBottom:8 }}>Welcome back</h2>
                <p style={{ marginBottom:28, fontSize:'0.88rem' }}>
                  Sign in with the same Google account you used to create your StarkSplit profile.
                </p>

                {walletError && (
                  <div style={{ background:'var(--red-glow)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'var(--r-md)', padding:'11px 15px', marginBottom:16, fontSize:'0.83rem', color:'var(--red)' }}>
                    ⚠ {walletError}
                  </div>
                )}

                <button
                  className="btn btn-primary"
                  onClick={onLogin}
                  disabled={isLoading}
                  style={{ width:'100%', padding:'16px', fontSize:'1rem', marginBottom:16 }}
                >
                  {isLoading
                    ? <><span className="spinner"/> Signing in…</>
                    : <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Sign in with Google
                      </>
                  }
                </button>

                <p style={{ textAlign:'center', fontSize:'0.72rem', color:'var(--text-500)' }}>
                  New here?{' '}
                  <button onClick={() => setMode('signup')} style={{ background:'none', color:'var(--orange-2)', cursor:'pointer', fontSize:'0.72rem' }}>
                    Create account
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* ── STEP 2: Connected, set username ── */}
        {address && !user && (
          <motion.div
            initial={{ opacity:0, scale:0.95 }}
            animate={{ opacity:1, scale:1 }}
            transition={{ duration:0.45 }}
            className="card card-glow"
            style={{ padding:'44px 32px' }}
          >
            <div style={{ textAlign:'center', marginBottom:28 }}>
              <div style={{
                width:52, height:52, borderRadius:'50%',
                background:'var(--green-glow)', border:'1px solid rgba(16,185,129,0.3)',
                display:'flex', alignItems:'center', justifyContent:'center',
                margin:'0 auto 18px', fontSize:'1.5rem',
              }}>
                ✓
              </div>
              <h2 style={{ fontSize:'1.4rem', marginBottom:8 }}>One last step</h2>
              <p style={{ fontSize:'0.88rem' }}>
                Pick your username — this is how friends find and tag you in splits.
              </p>
            </div>

            {/* Balance preview */}
            <div style={{
              background:    'var(--orange-glow)',
              border:        '1px solid var(--border-o)',
              borderRadius:  'var(--r-md)',
              padding:       '12px 16px',
              marginBottom:  20,
              display:       'flex',
              alignItems:    'center',
              justifyContent:'space-between',
            }}>
              <span style={{ fontSize:'0.8rem', color:'var(--text-300)' }}>Your testnet balance</span>
              <span style={{ fontFamily:'var(--font-display)', fontWeight:800, color:'var(--orange-2)', fontSize:'1rem' }}>
                10,000 STRK 🎉
              </span>
            </div>

            <div style={{ marginBottom:20 }}>
              <label className="label">Choose your username</label>
              <div className="input-group">
                <span className="input-prefix">@</span>
                <input
                  className="input"
                  placeholder="dontfadedave"
                  value={username}
                  onChange={e => { setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,'')); setUsernameErr('') }}
                  onKeyDown={e => e.key === 'Enter' && handleRegister()}
                  maxLength={20}
                  autoComplete="off"
                  spellCheck={false}
                  autoFocus
                />
              </div>
              {(usernameErr || authError) && (
                <p style={{ fontSize:'0.75rem', color:'var(--red)', marginTop:6 }}>⚠ {usernameErr || authError}</p>
              )}
              <p style={{ fontSize:'0.7rem', color:'var(--text-500)', marginTop:6 }}>
                3–20 chars · letters, numbers, underscore only
              </p>
            </div>

            <button
              className="btn btn-primary"
              onClick={handleRegister}
              disabled={authLoading || username.length < 3}
              style={{ width:'100%', padding:'15px', fontSize:'0.95rem' }}
            >
              {authLoading
                ? <><span className="spinner"/> Setting up…</>
                : `⚡ Claim @${username || 'username'}`
              }
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
        }
                
