import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { shortAddr } from '../lib/starkzap'
import { initials } from '../lib/utils'

export default function Navbar({ address, user, onLogin, onLogout, isLoading }) {
  const { pathname } = useLocation()
  const isLanding = pathname === '/' || pathname === ''

  return (
    <nav style={{
      position:             'sticky',
      top:                  0,
      zIndex:               200,
      borderBottom:         isLanding ? '1px solid transparent' : '1px solid var(--border)',
      background:           isLanding ? 'transparent' : 'rgba(7,7,14,0.85)',
      backdropFilter:       isLanding ? 'none' : 'blur(24px)',
      WebkitBackdropFilter: isLanding ? 'none' : 'blur(24px)',
      transition:           'all 0.3s ease',
    }}>
      {/* Top glow line */}
      {!isLanding && (
        <div style={{
          position:   'absolute',
          top: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg,transparent,rgba(255,100,0,0.5),rgba(255,184,0,0.3),transparent)',
        }}/>
      )}

      <div className="container-wide" style={{
        height:         64,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{
            width:        34, height: 34,
            borderRadius: '50%',
            overflow:     'hidden',
            flexShrink:   0,
            boxShadow:    '0 0 14px rgba(255,100,0,0.45)',
            border:       '1px solid rgba(255,120,0,0.3)',
          }}>
            <img src="/logo.svg" alt="StarkSplit" width={34} height={34} style={{ display:'block' }} />
          </div>
          <span style={{
            fontFamily:    'var(--font-display)',
            fontWeight:    800,
            fontSize:      '1.1rem',
            letterSpacing: '-0.025em',
            color:         'var(--text-100)',
          }}>
            Stark<span style={{
              background:           'linear-gradient(135deg,#FF4D00,#FFB800)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor:  'transparent',
              backgroundClip:       'text',
            }}>Split</span>
          </span>
        </Link>

        {/* Nav links — only when logged in */}
        {address && user && (
          <div style={{ display:'flex', gap:4, position:'absolute', left:'50%', transform:'translateX(-50%)' }}>
            {[
              { to: '/dashboard', label: 'Dashboard' },
              { to: '/create',    label: 'New Split'  },
              { to: '/send',      label: 'Send STRK'  },
            ].map(({ to, label }) => (
              <Link key={to} to={to} style={{
                fontFamily:    'var(--font-display)',
                fontWeight:    600,
                fontSize:      '0.82rem',
                padding:       '6px 14px',
                borderRadius:  'var(--r-full)',
                color:         pathname.startsWith(to) ? 'var(--orange-2)' : 'var(--text-300)',
                background:    pathname.startsWith(to) ? 'var(--orange-glow)' : 'transparent',
                border:        pathname.startsWith(to) ? '1px solid var(--border-o)' : '1px solid transparent',
                transition:    'all 0.2s ease',
              }}>
                {label}
              </Link>
            ))}
          </div>
        )}

        {/* Right */}
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          {address ? (
            <>
              {user && (
                <div style={{
                  display:'flex', alignItems:'center', gap:8,
                  background:'var(--bg-raised)',
                  border:'1px solid var(--border-2)',
                  borderRadius:'var(--r-full)',
                  padding:'5px 14px 5px 6px',
                }}>
                  <div className="avatar" style={{ width:26, height:26, fontSize:'0.65rem' }}>
                    {initials(user.username)}
                  </div>
                  <span style={{ fontSize:'0.8rem', color:'var(--text-300)', fontFamily:'var(--font-display)', fontWeight:600 }}>
                    @{user.username}
                  </span>
                </div>
              )}
              <button className="btn btn-ghost" onClick={onLogout} style={{ fontSize:'0.78rem', padding:'7px 14px' }}>
                Disconnect
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={onLogin} disabled={isLoading} style={{ fontSize:'0.85rem', padding:'9px 22px' }}>
              {isLoading ? <span className="spinner" style={{ width:16, height:16 }}/> : 'Launch App'}
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
