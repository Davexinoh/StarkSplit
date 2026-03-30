/**
 * pages/DashboardPage.jsx
 * The user's home after login.
 * Shows all bills they created + splits they're part of.
 */

import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getBillsByCreator } from '../lib/supabase'
import { fmtSTRK } from '../lib/starkzap'
import { fmtDate, sum } from '../lib/utils'

/* ── Bill card ───────────────────────────────────────────── */
function BillCard({ bill, delay }) {
  const splits    = bill.splits ?? []
  const paid      = splits.filter(s => s.paid)
  const pending   = splits.filter(s => !s.paid)
  const paidAmt   = sum(paid.map(s => s.amount))
  const totalAmt  = sum(splits.map(s => s.amount))
  const progress  = totalAmt > 0 ? (paidAmt / totalAmt) * 100 : 0
  const isSettled = pending.length === 0 && splits.length > 0

  return (
    <motion.div
      initial={{ opacity:0, y:20 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay, duration:0.5, ease:[0.16,1,0.3,1] }}
    >
      <Link to={`/bill/${bill.id}`} style={{ textDecoration:'none' }}>
        <div className="card card-hover" style={{ padding:'22px 20px' }}>
          {/* Header */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
            <div>
              <h3 style={{ fontSize:'1rem', marginBottom:4 }}>{bill.title}</h3>
              <p style={{ fontSize:'0.75rem', color:'var(--text-500)' }}>{fmtDate(bill.created_at)}</p>
            </div>
            <span className={isSettled ? 'badge badge-green' : 'badge badge-orange'}>
              {isSettled ? '✓ Settled' : `${pending.length} pending`}
            </span>
          </div>

          {/* Progress bar */}
          <div style={{
            height:       6,
            background:   'var(--bg-overlay)',
            borderRadius: 'var(--r-full)',
            overflow:     'hidden',
            marginBottom: 14,
          }}>
            <div style={{
              height:       '100%',
              width:        `${progress}%`,
              background:   isSettled
                ? 'linear-gradient(90deg,var(--green),#34d399)'
                : 'linear-gradient(90deg,var(--orange),var(--amber))',
              borderRadius: 'var(--r-full)',
              transition:   'width 0.6s ease',
            }}/>
          </div>

          {/* Stats */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ display:'flex', gap:6 }}>
              {splits.slice(0,5).map((s,i) => (
                <div key={i} style={{
                  width:         28, height:28,
                  borderRadius:  '50%',
                  background:    s.paid
                    ? 'linear-gradient(135deg,var(--green),#34d399)'
                    : 'linear-gradient(135deg,var(--orange),var(--amber))',
                  display:       'flex',
                  alignItems:    'center',
                  justifyContent:'center',
                  fontSize:      '0.6rem',
                  fontFamily:    'var(--font-display)',
                  fontWeight:    800,
                  color:         '#fff',
                  border:        '2px solid var(--bg-surface)',
                  marginLeft:    i > 0 ? -8 : 0,
                }}>
                  {s.username.slice(0,2).toUpperCase()}
                </div>
              ))}
              {splits.length > 5 && (
                <div style={{
                  width:28, height:28, borderRadius:'50%',
                  background:'var(--bg-overlay)', border:'2px solid var(--bg-surface)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'0.6rem', color:'var(--text-400)', marginLeft:-8,
                }}>
                  +{splits.length - 5}
                </div>
              )}
            </div>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize:   '0.9rem',
              color:      'var(--orange-2)',
            }}>
              {fmtSTRK(paidAmt)}/{fmtSTRK(totalAmt)} STRK
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

/* ── Empty state ─────────────────────────────────────────── */
function EmptyState() {
  return (
    <div style={{ textAlign:'center', padding:'60px 20px' }}>
      <div style={{ fontSize:'3rem', marginBottom:16 }}>🧾</div>
      <h3 style={{ fontSize:'1.1rem', marginBottom:8 }}>No splits yet</h3>
      <p style={{ fontSize:'0.88rem', marginBottom:24 }}>
        Create your first split and share it with your group.
      </p>
      <Link to="/create" className="btn btn-primary" style={{ display:'inline-flex' }}>
        ⚡ Create a Split
      </Link>
    </div>
  )
}

/* ── Main ────────────────────────────────────────────────── */
export default function DashboardPage({ user }) {
  const navigate       = useNavigate()
  const [bills, setBills]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getBillsByCreator(user.id)
      .then(setBills)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user])

  if (!user) {
    navigate('/auth')
    return null
  }

  const totalBills   = bills.length
  const settledBills = bills.filter(b => b.splits?.every(s => s.paid)).length
  const totalSTRK    = sum(bills.flatMap(b => (b.splits ?? []).filter(s => s.paid).map(s => s.amount)))

  return (
    <div className="page" style={{ padding:'40px 0 80px' }}>
      <div className="container">

        {/* Header */}
        <motion.div
          initial={{ opacity:0, y:20 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.5, ease:[0.16,1,0.3,1] }}
          style={{ marginBottom:32 }}
        >
          <p style={{ fontSize:'0.78rem', color:'var(--text-400)', fontFamily:'var(--font-display)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:6 }}>
            Welcome back
          </p>
          <h2 style={{ fontSize:'1.8rem', marginBottom:20 }}>@{user.username}</h2>

          {/* Stats row */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
            {[
              { label:'Bills',    val: totalBills },
              { label:'Settled',  val: settledBills },
              { label:'STRK in',  val: `${fmtSTRK(totalSTRK)}` },
            ].map(({ label, val }) => (
              <div key={label} className="card" style={{ padding:'16px 14px', textAlign:'center' }}>
                <p style={{ fontSize:'1.3rem', fontFamily:'var(--font-display)', fontWeight:800, color:'var(--text-100)', marginBottom:2 }}>
                  {val}
                </p>
                <p style={{ fontSize:'0.68rem', color:'var(--text-500)', textTransform:'uppercase', letterSpacing:'0.06em', fontFamily:'var(--font-display)', fontWeight:600 }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity:0, y:16 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay:0.1, duration:0.5, ease:[0.16,1,0.3,1] }}
          style={{ display:'flex', gap:10, marginBottom:28 }}
        >
          <Link to="/create" className="btn btn-primary" style={{ flex:1, justifyContent:'center', padding:'13px' }}>
            ⚡ New Split
          </Link>
          <Link to="/send" className="btn btn-ghost" style={{ flex:1, justifyContent:'center', padding:'13px' }}>
            ↗ Send STRK
          </Link>
        </motion.div>

        {/* Bills list */}
        <div style={{ marginBottom:12, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <label className="label" style={{ margin:0 }}>Your Splits</label>
          {bills.length > 0 && (
            <span style={{ fontSize:'0.72rem', color:'var(--text-500)' }}>{bills.length} total</span>
          )}
        </div>

        {loading ? (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {[1,2,3].map(i => (
              <div key={i} className="skeleton" style={{ height:120, borderRadius:'var(--r-lg)' }}/>
            ))}
          </div>
        ) : bills.length === 0 ? (
          <EmptyState />
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {bills.map((b, i) => (
              <BillCard key={b.id} bill={b} delay={i * 0.06} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
