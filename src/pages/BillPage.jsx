/**
 * pages/BillPage.jsx
 * Public shareable page for a bill.
 * Anyone with the link can view, login with Google, and pay their share.
 */

import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getBill, getSplitByBillAndUsername, markSplitPaid } from '../lib/supabase'
import { fmtSTRK, EXPLORER } from '../lib/starkzap'
import { fmtDate, sum, copyToClipboard } from '../lib/utils'
import { useTransfer } from '../hooks/useTransfer'
import Confetti from './Confetti'

const APP_URL = import.meta.env.VITE_APP_URL || window.location.origin

/* ── Split row ───────────────────────────────────────────── */
function SplitRow({ split }) {
  return (
    <div style={{
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'space-between',
      padding:        '12px 16px',
      background:     'var(--bg-raised)',
      border:         '1px solid var(--border)',
      borderRadius:   'var(--r-md)',
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <div className="avatar" style={{ width:32, height:32, fontSize:'0.72rem' }}>
          {split.username.slice(0,2).toUpperCase()}
        </div>
        <div>
          <p style={{ fontSize:'0.85rem', fontFamily:'var(--font-display)', fontWeight:600, color:'var(--text-200)' }}>
            @{split.username}
          </p>
          {split.paid && split.tx_hash && (
            <a
              href={`${EXPLORER}/tx/${split.tx_hash}`}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize:'0.68rem', color:'var(--green)' }}
            >
              {split.tx_hash.slice(0,10)}… ↗
            </a>
          )}
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          color:      'var(--text-100)',
          fontSize:   '0.9rem',
        }}>
          {fmtSTRK(split.amount)} STRK
        </span>
        <div className={split.paid ? 'dot-green' : 'dot-amber'}/>
      </div>
    </div>
  )
}

/* ── Confetti burst ──────────────────────────────────────── */
function Confetti({ active }) {
  const COLORS = ['#FF4D00','#FF8C00','#FFB800','#34d399','#fff','#c084fc']
  if (!active) return null
  return (
    <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:999, overflow:'hidden' }}>
      {Array.from({ length:50 },(_,i) => (
        <div key={i} style={{
          position:     'absolute',
          top:          '-10px',
          left:         `${Math.random()*100}%`,
          width:        6 + Math.random()*8,
          height:       6 + Math.random()*8,
          background:   COLORS[i % COLORS.length],
          borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          animation:    `confetti ${2+Math.random()*2}s ${Math.random()*1.5}s ease-in forwards`,
        }}/>
      ))}
    </div>
  )
}

/* ── Main ────────────────────────────────────────────────── */
export default function BillPage({ user, account, onLogin, isLoading: walletLoading, onDeduct, onAdd }) {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const { send, isLoading: sending, error: sendError } = useTransfer(onDeduct, onAdd)

  const [bill,     setBill]     = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [mySplit,  setMySplit]  = useState(null)
  const [success,  setSuccess]  = useState(false)
  const [confetti, setConfetti] = useState(false)
  const [copied,   setCopied]   = useState(false)

  const billLink = `${APP_URL}/#/bill/${id}`

  // Load bill
  useEffect(() => {
    getBill(id)
      .then(b => { setBill(b) })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  // Load user's split entry
  useEffect(() => {
    if (!bill || !user) return
    getSplitByBillAndUsername({ billId: bill.id, username: user.username })
      .then(setMySplit)
      .catch(() => {})
  }, [bill, user])

  const handlePay = async () => {
    if (!account || !mySplit) return
    // Recipient is the bill creator's wallet
    const creator = bill.splits?.find(s => s.username !== user?.username)
    // In real impl, look up creator wallet from users table
    // For demo, transfer to STRK contract itself as placeholder
    // Replace with: await getUserByUsername(bill.creator_username) → wallet_address
    const TO = '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7'

    const hash = await send({ account, to: TO, amount: mySplit.amount, toUsername: bill.creator_username })
    if (!hash) return

    await markSplitPaid({ splitId: mySplit.id, txHash: hash })
    setMySplit(prev => ({ ...prev, paid: true, tx_hash: hash }))
    setBill(prev => ({
      ...prev,
      splits: prev.splits.map(s => s.id === mySplit.id ? { ...s, paid:true, tx_hash:hash } : s)
    }))
    setSuccess(true)
    setConfetti(true)
    setTimeout(() => setConfetti(false), 4000)
  }

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <span className="spinner" style={{ width:28, height:28 }}/>
    </div>
  )

  if (notFound) return (
    <div style={{ minHeight:'80vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:24 }}>
      <h2 style={{ marginBottom:10 }}>Bill not found</h2>
      <p style={{ marginBottom:24 }}>This split link is invalid or expired.</p>
      <button className="btn btn-primary" onClick={() => navigate('/')}>Go home</button>
    </div>
  )

  const splits    = bill.splits ?? []
  const paid      = splits.filter(s => s.paid)
  const pending   = splits.filter(s => !s.paid)
  const paidAmt   = sum(paid.map(s => s.amount))
  const totalAmt  = sum(splits.map(s => s.amount))
  const progress  = totalAmt > 0 ? (paidAmt / totalAmt) * 100 : 0
  const isSettled = pending.length === 0 && splits.length > 0
  const userOwes  = mySplit && !mySplit.paid

  return (
    <>
      <Confetti active={confetti} />
      <div className="page" style={{ padding:'40px 0 80px' }}>
        <div className="container">

          {/* Bill header */}
          <motion.div
            initial={{ opacity:0, y:20 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.5, ease:[0.16,1,0.3,1] }}
            className="card card-glow"
            style={{ padding:'28px 24px', marginBottom:16 }}
          >
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
              <div>
                <p style={{ fontSize:'0.7rem', color:'var(--text-500)', fontFamily:'var(--font-display)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:6 }}>
                  {fmtDate(bill.created_at)}
                </p>
                <h2 style={{ fontSize:'1.4rem', marginBottom:4 }}>{bill.title}</h2>
                <p style={{ fontSize:'0.82rem', color:'var(--text-400)' }}>
                  {splits.length} people · {fmtSTRK(totalAmt)} STRK total
                </p>
              </div>
              <span className={isSettled ? 'badge badge-green' : 'badge badge-orange'}>
                {isSettled ? '✓ Settled' : `${pending.length} pending`}
              </span>
            </div>

            {/* Progress */}
            <div style={{ marginBottom:8 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                <span style={{ fontSize:'0.75rem', color:'var(--text-400)' }}>
                  {fmtSTRK(paidAmt)} of {fmtSTRK(totalAmt)} STRK collected
                </span>
                <span style={{ fontSize:'0.75rem', color:'var(--orange-2)', fontFamily:'var(--font-display)', fontWeight:700 }}>
                  {Math.round(progress)}%
                </span>
              </div>
              <div style={{ height:8, background:'var(--bg-overlay)', borderRadius:'var(--r-full)', overflow:'hidden' }}>
                <motion.div
                  initial={{ width:0 }}
                  animate={{ width:`${progress}%` }}
                  transition={{ duration:0.8, ease:[0.16,1,0.3,1] }}
                  style={{
                    height:       '100%',
                    background:   isSettled
                      ? 'linear-gradient(90deg,var(--green),#34d399)'
                      : 'linear-gradient(90deg,var(--orange),var(--amber))',
                    borderRadius: 'var(--r-full)',
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* Splits list */}
          <motion.div
            initial={{ opacity:0, y:16 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:0.1, duration:0.5 }}
            className="card"
            style={{ padding:'20px', marginBottom:16 }}
          >
            <label className="label" style={{ marginBottom:14 }}>Members</label>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {splits.map(s => <SplitRow key={s.id} split={s} />)}
            </div>
          </motion.div>

          {/* Pay section */}
          <motion.div
            initial={{ opacity:0, y:16 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:0.2, duration:0.5 }}
          >
            {/* Not logged in */}
            {!user && (
              <div className="card card-glow" style={{ padding:'28px 24px', textAlign:'center' }}>
                <h3 style={{ fontSize:'1.1rem', marginBottom:8 }}>Pay your share</h3>
                <p style={{ fontSize:'0.88rem', marginBottom:24 }}>
                  Sign in with Google to see your share and pay gaslessly.
                </p>
                <button
                  className="btn btn-primary"
                  onClick={onLogin}
                  disabled={walletLoading}
                  style={{ width:'100%', padding:'15px' }}
                >
                  {walletLoading ? <><span className="spinner"/> Connecting…</> : 'Sign in to Pay'}
                </button>
              </div>
            )}

            {/* Logged in, not in this split */}
            {user && !mySplit && (
              <div className="card" style={{ padding:'22px 20px', textAlign:'center' }}>
                <p style={{ fontSize:'0.88rem', color:'var(--text-400)' }}>
                  @{user.username} — you're not in this split.
                </p>
              </div>
            )}

            {/* Already paid */}
            {user && mySplit && mySplit.paid && (
              <div className="card" style={{ padding:'28px 24px', textAlign:'center', background:'var(--green-glow)', borderColor:'rgba(16,185,129,0.2)' }}>
                <div style={{ fontSize:'2.5rem', marginBottom:12 }}>✓</div>
                <h3 style={{ fontSize:'1.1rem', marginBottom:6, color:'var(--green)' }}>Paid!</h3>
                <p style={{ fontSize:'0.85rem', marginBottom:16 }}>
                  You paid {fmtSTRK(mySplit.amount)} STRK
                </p>
                {mySplit.tx_hash && (
                  <a
                    href={`${EXPLORER}/tx/${mySplit.tx_hash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-ghost"
                    style={{ fontSize:'0.8rem', padding:'9px 18px' }}
                  >
                    View on Starkscan ↗
                  </a>
                )}
              </div>
            )}

            {/* Owes — pay now */}
            {userOwes && (
              <div className="card card-glow" style={{ padding:'28px 24px' }}>
                <h3 style={{ fontSize:'1.1rem', marginBottom:6 }}>Your share</h3>
                <p style={{ fontSize:'0.88rem', marginBottom:20 }}>
                  You owe <span style={{ color:'var(--orange-2)', fontFamily:'var(--font-display)', fontWeight:700 }}>
                    {fmtSTRK(mySplit.amount)} STRK
                  </span> for "{bill.title}"
                </p>

                {sendError && (
                  <div style={{ background:'var(--red-glow)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'var(--r-md)', padding:'10px 14px', marginBottom:14, fontSize:'0.82rem', color:'var(--red)' }}>
                    ⚠ {sendError}
                  </div>
                )}

                <button
                  className="btn btn-primary"
                  onClick={handlePay}
                  disabled={sending || !account}
                  style={{ width:'100%', padding:'16px', fontSize:'0.95rem' }}
                >
                  {sending
                    ? <><span className="spinner"/> Sending…</>
                    : `⚡ Pay ${fmtSTRK(mySplit.amount)} STRK`
                  }
                </button>
                <p style={{ textAlign:'center', fontSize:'0.72rem', color:'var(--text-500)', marginTop:10 }}>
                  Gasless · Powered by AVNU Paymaster
                </p>
              </div>
            )}
          </motion.div>

          {/* Share link */}
          <motion.div
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            transition={{ delay:0.3 }}
            style={{ marginTop:16 }}
          >
            <div style={{
              background:'var(--bg-surface)', border:'1px solid var(--border)',
              borderRadius:'var(--r-md)', padding:'12px 14px',
              display:'flex', alignItems:'center', gap:10,
            }}>
              <span style={{ flex:1, fontSize:'0.74rem', color:'var(--text-500)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {billLink}
              </span>
              <button
                className="btn btn-outline"
                onClick={async () => { await copyToClipboard(billLink); setCopied(true); setTimeout(()=>setCopied(false),2000) }}
                style={{ padding:'6px 12px', fontSize:'0.74rem', flexShrink:0 }}
              >
                {copied ? '✓' : 'Copy link'}
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </>
  )
    }
                             
