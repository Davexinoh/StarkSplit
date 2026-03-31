import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { isValidUsername } from '../lib/utils'

export default function AuthPage({ isLoggedIn, hasProfile, isLoading, error, onRegister, onLogin, onClearError }) {
  const navigate   = useNavigate()
  const [mode, setMode] = useState('choose') // choose | signup | signin | forgot
  const [form, setForm] = useState({ email:'', password:'', username:'', confirmPassword:'' })
  const [localErr, setLocalErr] = useState('')
  const [forgotSent, setForgotSent] = useState(false)

  useEffect(() => {
    if (isLoggedIn && hasProfile) navigate('/dashboard')
  }, [isLoggedIn, hasProfile])

  const set = (k, v) => { setForm(f => ({...f, [k]:v})); setLocalErr(''); onClearError?.() }

  const handleSignup = async () => {
    if (!form.email)                            { setLocalErr('Email required'); return }
    if (form.password.length < 6)               { setLocalErr('Password must be 6+ chars'); return }
    if (form.password !== form.confirmPassword) { setLocalErr('Passwords do not match'); return }
    if (!isValidUsername(form.username))        { setLocalErr('Username: 3–20 chars, letters/numbers/underscore'); return }
    await onRegister({ email: form.email, password: form.password, username: form.username })
  }

  const handleLogin = async () => {
    if (!form.email || !form.password) { setLocalErr('Email and password required'); return }
    await onLogin({ email: form.email, password: form.password })
  }

  const displayErr = localErr || error

  return (
    <div style={{
      minHeight:'100dvh', display:'flex', alignItems:'center',
      justifyContent:'center', padding:'40px 20px', position:'relative', zIndex:1,
    }}>
      <div style={{
        position:'absolute', top:'40%', left:'50%',
        transform:'translate(-50%,-50%)',
        width:500, height:500, borderRadius:'50%',
        background:'radial-gradient(circle,rgba(255,77,0,0.10) 0%,transparent 70%)',
        pointerEvents:'none',
      }}/>

      <motion.div
        initial={{ opacity:0, y:24 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:0.5, ease:[0.16,1,0.3,1] }}
        style={{ width:'100%', maxWidth:440 }}
      >
        <AnimatePresence mode="wait">

          {/* ── Choose ── */}
          {mode === 'choose' && (
            <motion.div key="choose"
              initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.95 }}
              transition={{ duration:0.3 }}
              className="card card-glow" style={{ padding:'44px 32px', textAlign:'center' }}
            >
              <div style={{
                width:64, height:64, borderRadius:'var(--r-lg)',
                background:'linear-gradient(135deg,var(--orange),var(--amber))',
                display:'flex', alignItems:'center', justifyContent:'center',
                margin:'0 auto 22px', boxShadow:'var(--shadow-btn)', fontSize:'1.8rem',
              }}>⚡</div>
              <h2 style={{ fontSize:'1.7rem', marginBottom:8 }}>StarkSplit</h2>
              <p style={{ marginBottom:32, fontSize:'0.88rem' }}>
                Split bills with anyone, anywhere. No crypto wallet needed.
              </p>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                <button className="btn btn-primary" onClick={() => setMode('signup')}
                  style={{ width:'100%', padding:'15px', fontSize:'1rem' }}>
                  🚀 Create account
                </button>
                <button className="btn btn-ghost" onClick={() => setMode('signin')}
                  style={{ width:'100%', padding:'15px', fontSize:'1rem' }}>
                  Sign in
                </button>
              </div>
              <p style={{ marginTop:20, fontSize:'0.7rem', color:'var(--text-500)' }}>
                Powered by Starkzap · Starknet Sepolia
              </p>
            </motion.div>
          )}

          {/* ── Sign up ── */}
          {mode === 'signup' && (
            <motion.div key="signup"
              initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}
              transition={{ duration:0.3 }}
              className="card card-glow" style={{ padding:'36px 28px' }}
            >
              <button onClick={() => { setMode('choose'); setLocalErr('') }}
                style={{ background:'none', color:'var(--text-400)', fontSize:'0.82rem', cursor:'pointer', marginBottom:18, display:'flex', alignItems:'center', gap:6 }}>
                ← Back
              </button>
              <h2 style={{ fontSize:'1.4rem', marginBottom:6 }}>Create account</h2>
              <p style={{ fontSize:'0.85rem', marginBottom:24 }}>
                You'll start with <span style={{ color:'var(--orange-2)', fontWeight:700 }}>10,000 testnet STRK</span> 🎉
              </p>

              {displayErr && (
                <div style={{ background:'var(--red-glow)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'var(--r-md)', padding:'10px 14px', marginBottom:14, fontSize:'0.82rem', color:'var(--red)' }}>
                  ⚠ {displayErr}
                </div>
              )}

              <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:16 }}>
                <div>
                  <label className="label">Username</label>
                  <div className="input-group">
                    <span className="input-prefix">@</span>
                    <input className="input" placeholder="dontfadedave"
                      value={form.username}
                      onChange={e => set('username', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,''))}
                      maxLength={20} autoComplete="off" spellCheck={false} />
                  </div>
                </div>
                <div>
                  <label className="label">Email</label>
                  <input className="input" type="email" placeholder="you@email.com"
                    value={form.email} onChange={e => set('email', e.target.value)} autoComplete="email" />
                </div>
                <div>
                  <label className="label">Password</label>
                  <input className="input" type="password" placeholder="6+ characters"
                    value={form.password} onChange={e => set('password', e.target.value)} autoComplete="new-password" />
                </div>
                <div>
                  <label className="label">Confirm Password</label>
                  <input className="input" type="password" placeholder="Same password"
                    value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSignup()} />
                </div>
              </div>

              <button className="btn btn-primary" onClick={handleSignup} disabled={isLoading}
                style={{ width:'100%', padding:'15px', fontSize:'0.95rem', marginBottom:12 }}>
                {isLoading ? <><span className="spinner"/> Creating account…</> : '⚡ Create account'}
              </button>
              <p style={{ textAlign:'center', fontSize:'0.75rem', color:'var(--text-500)' }}>
                Already have an account?{' '}
                <button onClick={() => { setMode('signin'); setLocalErr('') }}
                  style={{ background:'none', color:'var(--orange-2)', cursor:'pointer', fontSize:'0.75rem' }}>
                  Sign in
                </button>
              </p>
            </motion.div>
          )}

          {/* ── Sign in ── */}
          {mode === 'signin' && (
            <motion.div key="signin"
              initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}
              transition={{ duration:0.3 }}
              className="card card-glow" style={{ padding:'36px 28px' }}
            >
              <button onClick={() => { setMode('choose'); setLocalErr('') }}
                style={{ background:'none', color:'var(--text-400)', fontSize:'0.82rem', cursor:'pointer', marginBottom:18, display:'flex', alignItems:'center', gap:6 }}>
                ← Back
              </button>
              <h2 style={{ fontSize:'1.4rem', marginBottom:6 }}>Welcome back</h2>
              <p style={{ fontSize:'0.85rem', marginBottom:24 }}>Sign in to your StarkSplit account.</p>

              {displayErr && (
                <div style={{ background:'var(--red-glow)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'var(--r-md)', padding:'10px 14px', marginBottom:14, fontSize:'0.82rem', color:'var(--red)' }}>
                  ⚠ {displayErr}
                </div>
              )}

              <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:16 }}>
                <div>
                  <label className="label">Email</label>
                  <input className="input" type="email" placeholder="you@email.com"
                    value={form.email} onChange={e => set('email', e.target.value)} autoComplete="email" />
                </div>
                <div>
                  <label className="label">Password</label>
                  <input className="input" type="password" placeholder="Your password"
                    value={form.password} onChange={e => set('password', e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    autoComplete="current-password" />
                </div>
              </div>

              <button className="btn btn-primary" onClick={handleLogin} disabled={isLoading}
                style={{ width:'100%', padding:'15px', fontSize:'0.95rem', marginBottom:12 }}>
                {isLoading ? <><span className="spinner"/> Signing in…</> : 'Sign in →'}
              </button>

              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <p style={{ fontSize:'0.75rem', color:'var(--text-500)' }}>
                  New here?{' '}
                  <button onClick={() => { setMode('signup'); setLocalErr('') }}
                    style={{ background:'none', color:'var(--orange-2)', cursor:'pointer', fontSize:'0.75rem' }}>
                    Create account
                  </button>
                </p>
                <button onClick={() => setMode('forgot')}
                  style={{ background:'none', color:'var(--text-500)', cursor:'pointer', fontSize:'0.72rem' }}>
                  Forgot password?
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Forgot password ── */}
          {mode === 'forgot' && (
            <motion.div key="forgot"
              initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}
              transition={{ duration:0.3 }}
              className="card card-glow" style={{ padding:'36px 28px' }}
            >
              <button onClick={() => setMode('signin')}
                style={{ background:'none', color:'var(--text-400)', fontSize:'0.82rem', cursor:'pointer', marginBottom:18, display:'flex', alignItems:'center', gap:6 }}>
                ← Back
              </button>
              {!forgotSent ? (
                <>
                  <h2 style={{ fontSize:'1.4rem', marginBottom:8 }}>Reset password</h2>
                  <p style={{ fontSize:'0.85rem', marginBottom:24 }}>
                    Enter your email and we'll send a reset link.
                  </p>
                  <div style={{ marginBottom:16 }}>
                    <label className="label">Email</label>
                    <input className="input" type="email" placeholder="you@email.com"
                      value={form.email} onChange={e => set('email', e.target.value)} />
                  </div>
                  <button className="btn btn-primary" disabled={isLoading || !form.email}
                    onClick={async () => {
                      try {
                        const { resetPassword } = await import('../lib/supabase')
                        await resetPassword(form.email)
                        setForgotSent(true)
                      } catch(e) { setLocalErr(e.message) }
                    }}
                    style={{ width:'100%', padding:'14px' }}>
                    Send reset link
                  </button>
                </>
              ) : (
                <div style={{ textAlign:'center', padding:'20px 0' }}>
                  <div style={{ fontSize:'2.5rem', marginBottom:14 }}>📧</div>
                  <h3 style={{ fontSize:'1.1rem', marginBottom:8 }}>Check your email</h3>
                  <p style={{ fontSize:'0.85rem', marginBottom:20 }}>
                    Reset link sent to {form.email}
                  </p>
                  <button className="btn btn-ghost" onClick={() => { setMode('signin'); setForgotSent(false) }}
                    style={{ width:'100%' }}>
                    Back to sign in
                  </button>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  )
                           }
                  
