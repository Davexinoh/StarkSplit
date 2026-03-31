import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { shortAddr } from '../lib/starkzap'
import { initials } from '../lib/utils'

export default function Navbar({ address, user, isLoggedIn, onLogin, onLogout, isLoading }) {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const isLanding = pathname === '/' || pathname === ''

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: '⚡' },
    { to: '/create',    label: 'New Split',  icon: '＋' },
    { to: '/send',      label: 'Send STRK',  icon: '↗' },
  ]

  return (
    <>
      <nav style={{
        position:             'sticky',
        top:                  0,
        zIndex:               200,
        borderBottom:         '1px solid var(--border)',
        background:           'rgba(7,7,14,0.90)',
        backdropFilter:       'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}>
        {/* Top glow line — always visible */}
        <div style={{
          position:   'absolute',
          top: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg,transparent,rgba(255,100,0,0.45),rgba(255,184,0,0.25),transparent)',
        }}/>

        <div style={{
          maxWidth:       960,
          margin:         '0 auto',
          padding:        '0 16px',
          height:         60,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          gap:            8,
        }}>

          {/* ── Logo ── */}
          <Link to="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
            <div style={{
              width:        32, height: 32,
              borderRadius: '50%',
              overflow:     'hidden',
              flexShrink:   0,
              boxShadow:    '0 0 12px rgba(255,100,0,0.4)',
              border:       '1px solid rgba(255,120,0,0.3)',
            }}>
              <img src="/logo.svg" alt="StarkSplit" width={32} height={32} style={{ display:'block' }} />
            </div>
            <span style={{
              fontFamily:    'var(--font-display)',
              fontWeight:    800,
              fontSize:      '1rem',
              letterSpacing: '-0.025em',
              color:         'var(--text-100)',
              whiteSpace:    'nowrap',
            }}>
              Stark<span style={{
                background:           'linear-gradient(135deg,#FF4D00,#FFB800)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor:  'transparent',
                backgroundClip:       'text',
              }}>Split</span>
            </span>
          </Link>

          {/* ── Desktop nav links ── */}
          {isLoggedIn && user && (
            <div style={{ display:'flex', gap:2, flex:1, justifyContent:'center' }}>
              {navLinks.map(({ to, label }) => (
                <Link key={to} to={to} style={{
                  fontFamily:    'var(--font-display)',
                  fontWeight:    600,
                  fontSize:      '0.8rem',
                  padding:       '6px 12px',
                  borderRadius:  'var(--r-full)',
                  color:         pathname.startsWith(to) ? 'var(--orange-2)' : 'var(--text-400)',
                  background:    pathname.startsWith(to) ? 'var(--orange-glow)' : 'transparent',
                  border:        pathname.startsWith(to) ? '1px solid var(--border-o)' : '1px solid transparent',
                  transition:    'all 0.2s ease',
                  whiteSpace:    'nowrap',
                  textDecoration:'none',
                }}>
                  {label}
                </Link>
              ))}
            </div>
          )}

          {/* ── Right ── */}
          <div style={{ display:'flex', alignItems:'center', gap:6, flexShrink:0 }}>
            {isLoggedIn ? (
              <>
                {user && (
                  <div style={{
                    display:'flex', alignItems:'center', gap:6,
                    background:'var(--bg-raised)',
                    border:'1px solid var(--border-2)',
                    borderRadius:'var(--r-full)',
                    padding:'4px 10px 4px 5px',
                  }}>
                    <div className="avatar" style={{ width:24, height:24, fontSize:'0.6rem' }}>
                      {initials(user.username)}
                    </div>
                    <span style={{ fontSize:'0.75rem', color:'var(--text-300)', fontFamily:'var(--font-display)', fontWeight:600 }}>
                      @{user.username}
                    </span>
                  </div>
                )}
                {/* Mobile menu toggle */}
                {isLoggedIn && user && (
                  <button
                    onClick={() => setMenuOpen(o => !o)}
                    style={{ background:'var(--bg-raised)', border:'1px solid var(--border-2)', borderRadius:'var(--r-sm)', padding:'6px 8px', color:'var(--text-300)', fontSize:'1rem', display:'flex', alignItems:'center', cursor:'pointer' }}
                  >
                    {menuOpen ? '✕' : '☰'}
                  </button>
                )}
                <button className="btn btn-ghost" onClick={onLogout} style={{ fontSize:'0.75rem', padding:'6px 12px' }}>
                  Out
                </button>
              </>
            ) : (
              <button className="btn btn-primary" onClick={onLogin} disabled={isLoading} style={{ fontSize:'0.82rem', padding:'9px 18px' }}>
                {isLoading ? <span className="spinner" style={{ width:15, height:15 }}/> : '⚡ Launch App'}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ── Mobile dropdown menu ── */}
      {menuOpen && isLoggedIn && user && (
        <div style={{
          position:   'fixed',
          top:        60,
          left:       0,
          right:      0,
          zIndex:     199,
          background: 'rgba(7,7,14,0.97)',
          borderBottom: '1px solid var(--border)',
          padding:    '12px 16px 20px',
          backdropFilter: 'blur(24px)',
        }}>
          {navLinks.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              style={{
                display:       'flex',
                alignItems:    'center',
                gap:           12,
                padding:       '14px 16px',
                borderRadius:  'var(--r-md)',
                color:         pathname.startsWith(to) ? 'var(--orange-2)' : 'var(--text-200)',
                background:    pathname.startsWith(to) ? 'var(--orange-glow)' : 'transparent',
                border:        pathname.startsWith(to) ? '1px solid var(--border-o)' : '1px solid transparent',
                textDecoration:'none',
                fontFamily:    'var(--font-display)',
                fontWeight:    700,
                fontSize:      '1rem',
                marginBottom:  4,
              }}
            >
              <span style={{ fontSize:'1.1rem' }}>{icon}</span>
              {label}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
