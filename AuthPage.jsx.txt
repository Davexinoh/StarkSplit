import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { isValidUsername } from '../lib/utils'

export default function AuthPage({ address, user, onLogin, isLoading, walletError, onRegister, authLoading, authError }) {
  const navigate        = useNavigate()
  const [username, setUsername]     = useState('')
  const [usernameErr, setUsernameErr] = useState('')

  // Redirect if fully authenticated
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
    <div className="page" style={{
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      padding:        '40px 20px',
    }}>
      <motion.div
        initial={{ opacity:0, scale:0.92 }}
        animate={{ opacity:1, scale:1 }}
        transition={{ duration:0.5, ease:[0.16,1,0.3,1] }}
        style={{ width:'100%', maxWidth:420 }}
      >
        {/* Step 1 — Connect wallet */}
        {!address && (
          <div className="card card-glow" style={{ padding:'44px 32px', textAlign:'center' }}>
            <div style={{
              width:         60, height:60,
              borderRadius:  'var(--r-lg)',
              background:    'linear-gradient(135deg,var(--orange),var(--amber))',
              display:       'flex',
              alignItems:    'center',
              justifyContent:'center',
              margin:        '0 auto 24px',
              boxShadow:     'var(--shadow-btn)',
              fontSize:      '1.6rem',
            }}>
              ⚡
            </div>

            <h2 style={{ fontSize:'1.6rem', marginBottom:10 }}>Welcome to StarkSplit</h2>
            <p style={{ marginBottom:32, fontSize:'0.9rem', maxWidth:280, margin:'0 auto 32px' }}>
              Sign in with Google to create your Starknet wallet. No seed phrase. No crypto knowledge needed.
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
              style={{ width:'100%', padding:'16px', fontSize:'1rem' }}
            >
              {isLoading
                ? <><span className="spinner"/> Connecting…</>
                : <>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M9 1.5C4.86 1.5 1.5 4.86 1.5 9C1.5 13.14 4.86 16.5 9 16.5C13.14 16.5 16.5 13.14 16.5 9C16.5 4.86 13.14 1.5 9 1.5ZM7.5 12.75L3.75 9L4.8075 7.9425L7.5 10.6275L13.1925 4.935L14.25 6L7.5 12.75Z" fill="white"/>
                    </svg>
                    Sign in with Google
                  </>
              }
            </button>

            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:16, marginTop:20 }}>
              {['Powered by Cartridge','Gasless via AVNU','Starknet L2'].map((t,i) => (
                <React.Fragment key={t}>
                  {i > 0 && <span style={{ color:'var(--border-3)', fontSize:'0.65rem' }}>·</span>}
                  <span style={{ fontSize:'0.7rem', color:'var(--text-500)' }}>{t}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 — Set username */}
        {address && !user && (
          <div className="card card-glow" style={{ padding:'44px 32px' }}>
            <div style={{ textAlign:'center', marginBottom:32 }}>
              <div style={{
                width:         52, height:52,
                borderRadius:  '50%',
                background:    'var(--green-glow)',
                border:        '1px solid rgba(16,185,129,0.25)',
                display:       'flex',
                alignItems:    'center',
                justifyContent:'center',
                margin:        '0 auto 20px',
                fontSize:      '1.4rem',
              }}>
                ✓
              </div>
              <h2 style={{ fontSize:'1.5rem', marginBottom:8 }}>Wallet connected!</h2>
              <p style={{ fontSize:'0.88rem' }}>
                Now pick a username. This is how friends find you on StarkSplit.
              </p>
            </div>

            <div style={{ marginBottom:20 }}>
              <label className="label">Choose your username</label>
              <div className="input-group">
                <span className="input-prefix">@</span>
                <input
                  className="input"
                  placeholder="dontfadedave"
                  value={username}
                  onChange={e => {
                    setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,''))
                    setUsernameErr('')
                  }}
                  onKeyDown={e => e.key === 'Enter' && handleRegister()}
                  maxLength={20}
                  autoComplete="off"
                  spellCheck={false}
                  autoFocus
                />
              </div>
              {usernameErr && (
                <p style={{ fontSize:'0.75rem', color:'var(--red)', marginTop:6 }}>⚠ {usernameErr}</p>
              )}
              {authError && (
                <p style={{ fontSize:'0.75rem', color:'var(--red)', marginTop:6 }}>⚠ {authError}</p>
              )}
              <p style={{ fontSize:'0.72rem', color:'var(--text-500)', marginTop:6 }}>
                3–20 chars · letters, numbers, underscore
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
                : 'Claim @' + (username || 'username')
              }
            </button>
          </div>
        )}
      </motion.div>
    </div>
  )
}
