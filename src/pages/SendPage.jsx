/**
 * pages/SendPage.jsx
 * Send STRK to any StarkSplit username or raw Starknet address.
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getUserByUsername } from '../lib/supabase'
import { fmtSTRK, EXPLORER } from '../lib/starkzap'
import { useTransfer } from '../hooks/useTransfer'

export default function SendPage({ user, account }) {
  const navigate = useNavigate()
  const { send, txHash, isLoading, isSuccess, error, reset } = useTransfer(onDeduct, onAdd)

  const [recipient, setRecipient] = useState('')
  const [amount,    setAmount]    = useState('')
  const [resolving, setResolving] = useState(false)
  const [resolved,  setResolved]  = useState(null)  // { address, username? }
  const [resolveErr,setResolveErr]= useState('')

  if (!user) { navigate('/auth'); return null }

  /* ── Resolve username → address ── */
  const resolve = async () => {
    const r = recipient.trim().replace('@','')
    if (!r) return
    setResolving(true)
    setResolveErr('')
    setResolved(null)

    try {
      // If starts with 0x, treat as raw address
      if (r.startsWith('0x') && r.length > 20) {
        setResolved({ address: r })
      } else {
        const u = await getUserByUsername(r)
        if (!u) { setResolveErr(`@${r} not found on StarkSplit`); return }
        setResolved({ address: u.wallet_address, username: u.username })
      }
    } catch {
      setResolveErr('Could not resolve recipient')
    } finally {
      setResolving(false)
    }
  }

  const handleSend = async () => {
    if (!resolved?.address || !amount) return
    await send({ account, to: resolved.address, amount, toUsername: resolved.username })
  }

  /* ── Success state ── */
  if (isSuccess && txHash) {
    return (
      <div className="page" style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 20px' }}>
        <motion.div
          initial={{ opacity:0, scale:0.92 }}
          animate={{ opacity:1, scale:1 }}
          transition={{ duration:0.5, ease:[0.16,1,0.3,1] }}
          style={{ width:'100%', maxWidth:420, textAlign:'center' }}
        >
          <div className="card card-glow" style={{ padding:'44px 32px' }}>
            <div style={{
              width:64, height:64, borderRadius:'50%',
              background:'linear-gradient(135deg,var(--orange),var(--amber))',
              display:'flex', alignItems:'center', justifyContent:'center',
              margin:'0 auto 20px', fontSize:'1.8rem',
              boxShadow:'var(--shadow-btn)', animation:'checkPop 0.4s ease',
            }}>
              ⚡
            </div>
            <h2 style={{ fontSize:'1.5rem', marginBottom:8 }}>STRK Sent!</h2>
            <p style={{ marginBottom:8, fontSize:'0.9rem' }}>
              {fmtSTRK(amount)} STRK → {resolved?.username ? `@${resolved.username}` : `${resolved?.address?.slice(0,10)}…`}
            </p>
            <p style={{ fontSize:'0.78rem', color:'var(--text-500)', marginBottom:28 }}>
              Gasless · Powered by AVNU
            </p>

            <a
              href={`${EXPLORER}/tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost"
              style={{ display:'inline-flex', marginBottom:12, width:'100%', justifyContent:'center' }}
            >
              View on Starkscan ↗
            </a>
            <button
              className="btn btn-primary"
              onClick={() => { reset(); setRecipient(''); setAmount(''); setResolved(null) }}
              style={{ width:'100%' }}
            >
              Send another
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="page" style={{ padding:'40px 0 80px' }}>
      <div className="container">

        <motion.div
          initial={{ opacity:0, y:20 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.5 }}
          style={{ marginBottom:28 }}
        >
          <button
            onClick={() => navigate('/dashboard')}
            style={{ background:'none', color:'var(--text-400)', fontSize:'0.82rem', cursor:'pointer', marginBottom:16, display:'flex', alignItems:'center', gap:6 }}
          >
            ← Dashboard
          </button>
          <h2 style={{ fontSize:'1.6rem', marginBottom:6 }}>Send STRK</h2>
          <p style={{ fontSize:'0.88rem' }}>Send to any StarkSplit username or Starknet address.</p>
        </motion.div>

        <motion.div
          initial={{ opacity:0, y:16 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay:0.06, duration:0.5 }}
          className="card"
          style={{ padding:'24px 20px', marginBottom:16 }}
        >
          {/* Recipient */}
          <div style={{ marginBottom:20 }}>
            <label className="label">To</label>
            <div style={{ display:'flex', gap:8 }}>
              <div className="input-group" style={{ flex:1 }}>
                <span className="input-prefix">@</span>
                <input
                  className="input"
                  placeholder="username or 0x address"
                  value={recipient}
                  onChange={e => { setRecipient(e.target.value); setResolved(null); setResolveErr('') }}
                  onKeyDown={e => e.key === 'Enter' && resolve()}
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
              <button
                className="btn btn-outline"
                onClick={resolve}
                disabled={resolving || !recipient.trim()}
                style={{ padding:'0 18px', flexShrink:0 }}
              >
                {resolving ? <span className="spinner"/> : 'Find'}
              </button>
            </div>

            {resolveErr && (
              <p style={{ fontSize:'0.75rem', color:'var(--red)', marginTop:6 }}>⚠ {resolveErr}</p>
            )}

            {resolved && (
              <motion.div
                initial={{ opacity:0, y:-8 }}
                animate={{ opacity:1, y:0 }}
                style={{
                  display:'flex', alignItems:'center', gap:10,
                  background:'var(--green-glow)', border:'1px solid rgba(16,185,129,0.2)',
                  borderRadius:'var(--r-md)', padding:'10px 14px', marginTop:8,
                }}
              >
                <span style={{ fontSize:'0.8rem', color:'var(--green)' }}>✓</span>
                {resolved.username && (
                  <div className="avatar" style={{ width:26, height:26, fontSize:'0.6rem' }}>
                    {resolved.username.slice(0,2).toUpperCase()}
                  </div>
                )}
                <div>
                  {resolved.username && (
                    <p style={{ fontSize:'0.82rem', fontFamily:'var(--font-display)', fontWeight:600, color:'var(--text-200)' }}>
                      @{resolved.username}
                    </p>
                  )}
                  <p style={{ fontSize:'0.7rem', color:'var(--text-400)', fontFamily:'monospace' }}>
                    {resolved.address?.slice(0,18)}…
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Amount */}
          <div style={{ marginBottom:20 }}>
            <label className="label">Amount</label>
            <div className="input-group">
              <input
                className="input"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                min="0.01"
                step="0.01"
                style={{ paddingRight:60, fontSize:'1.2rem', fontFamily:'var(--font-display)', fontWeight:700 }}
              />
              <span className="input-suffix" style={{ fontSize:'0.9rem' }}>STRK</span>
            </div>
            <p style={{ fontSize:'0.72rem', color:'var(--text-500)', marginTop:6 }}>
              Gasless · AVNU Paymaster covers fees
            </p>
          </div>

          {error && (
            <div style={{ background:'var(--red-glow)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'var(--r-md)', padding:'10px 14px', marginBottom:14, fontSize:'0.82rem', color:'var(--red)' }}>
              ⚠ {error}
            </div>
          )}

          <button
            className="btn btn-primary"
            onClick={handleSend}
            disabled={isLoading || !resolved || !amount || Number(amount) <= 0}
            style={{ width:'100%', padding:'16px', fontSize:'1rem' }}
          >
            {isLoading
              ? <><span className="spinner"/> Sending…</>
              : `⚡ Send ${amount ? fmtSTRK(amount) : ''} STRK`
            }
          </button>
        </motion.div>

        {/* Info card */}
        <motion.div
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          transition={{ delay:0.2 }}
          className="card"
          style={{ padding:'18px 20px' }}
        >
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {[
              { icon:'⚡', text:'Gasless — AVNU Paymaster covers all fees' },
              { icon:'🌍', text:'Works anywhere in the world, any device' },
              { icon:'🔗', text:'Tx verifiable on Starkscan in seconds' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:'1rem' }}>{icon}</span>
                <p style={{ fontSize:'0.8rem' }}>{text}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  )
          }
  
