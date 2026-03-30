import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      borderTop:  '1px solid var(--border)',
      padding:    '28px 24px',
      marginTop:  'auto',
      position:   'relative',
      zIndex:     1,
    }}>
      <div className="container-wide" style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        flexWrap:       'wrap',
        gap:            12,
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{
            fontFamily:    'var(--font-display)',
            fontWeight:    800,
            fontSize:      '0.9rem',
            color:         'var(--text-100)',
            letterSpacing: '-0.02em',
          }}>
            Stark<span style={{
              background:           'linear-gradient(135deg,#FF4D00,#FFB800)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor:  'transparent',
              backgroundClip:       'text',
            }}>Split</span>
          </span>
        </div>

        <p style={{ fontSize:'0.72rem', color:'var(--text-500)', textAlign:'center' }}>
          Built with{' '}
          <a href="https://github.com/keep-starknet-strange/starkzap" target="_blank" rel="noreferrer">Starkzap</a>
          {' · '}
          <a href="https://starknet.io" target="_blank" rel="noreferrer">Starknet</a>
          {' · '}
          Sepolia Testnet
        </p>

        <p style={{ fontSize:'0.72rem', color:'var(--text-500)' }}>
          by{' '}
          <a href="https://twitter.com/dontfadedave" target="_blank" rel="noreferrer">@dontfadedave</a>
        </p>
      </div>
    </footer>
  )
}
