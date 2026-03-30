import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getBillsByCreator } from '../lib/supabase'
import { fmtSTRK } from '../lib/starkzap'
import { fmtDate, sum } from '../lib/utils'
import ScrollReveal from '../components/ScrollReveal'

function BillCard({ bill, delay }) {
  const splits   = bill.splits ?? []
  const paid     = splits.filter(s => s.paid)
  const pending  = splits.filter(s => !s.paid)
  const paidAmt  = sum(paid.map(s => s.amount))
  const totalAmt = sum(splits.map(s => s.amount))
  const progress = totalAmt > 0 ? (paidAmt / totalAmt) * 100 : 0
  const settled  = pending.length === 0 && splits.length > 0

  return (
    <motion.div
      initial={{ opacity:0, y:16 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay, duration:0.45, ease:[0.16,1,0.3,1] }}
    >
      <Link to={`/bill/${bill.id}`} style={{ textDecoration:'none' }}>
        <div className="card card-hover" style={{ padding:'20px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
            <div>
              <h3 style={{ fontSize:'0.95rem', marginBottom:3, fontFamily:'var(--font-display)' }}>{bill.title}</h3>
              <p style={{ fontSize:'0.72rem', color:'var(--text-500)' }}>{fmtDate(bill.created_at)} · {splits.length} people</p>
            </div>
            <span className={settled ? 'badge badge-green' : 'badge badge-orange'} style={{ fontSize:'0.62rem', padding:'3px 10px' }}>
              {settled ? '✓ Settled' : `${pending.length} pending`}
            </span>
          </div>

          <div style={{ height:5, background:'var(--bg-overlay)', borderRadius:'var(--r-full)', overflow:'hidden', marginBottom:12 }}>
            <motion.div
              initial={{ width:0 }}
              animate={{ width:`${progress}%` }}
              transition={{ duration:0.8, delay:delay+0.2 }}
              style={{
                height:'100%',
                background: settled
                  ? 'linear-gradient(90deg,var(--green),#34d399)'
                  : 'linear-gradient(90deg,var(--orange),var(--amber))',
                borderRadius:'var(--r-full)',
              }}
            />
          </div>

          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ display:'flex' }}>
              {splits.slice(0,4).map((s,i) => (
                <div key={i} style={{
                  width:26, height:26, borderRadius:'50%',
                  background: s.paid
                    ? 'linear-gradient(135deg,var(--green),#34d399)'
                    : 'linear-gradient(135deg,var(--orange),var(--amber))',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'0.58rem', fontFamily:'var(--font-display)', fontWeight:800, color:'#fff',
                  border:'2px solid var(--bg-surface)',
                  marginLeft: i > 0 ? -8 : 0,
                }}>
                  {s.username.slice(0,2).toUpperCase()}
                </div>
              ))}
            </div>
            <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'0.85rem', color:'var(--orange-2)' }}>
              {fmtSTRK(paidAmt)}/{fmtSTRK(totalAmt)} STRK
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function DashboardPage({ user, balance }) {
  const navigate = useNavigate()
  const [bills,   setBills]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getBillsByCreator(user.id)
      .then(setBills)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user])

  if (!user) { navigate('/auth'); return null }

  const settledCount = bills.filter(b => b.splits?.every(s => s.paid)).length
  const totalIn      = sum(bills.flatMap(b => (b.splits ?? []).filter(s => s.paid).map(s => s.amount)))

  return (
    <div style={{ minHeight:'100dvh', paddingBottom:80, position:'relative', zIndex:1 }}>

      {/* ── Header ── */}
      <div style={{
        background:    'linear-gradient(180deg, rgba(255,77,0,0.06) 0%, transparent 100%)',
        borderBottom:  '1px solid var(--border)',
        padding:       '32px 20px 28px',
      }}>
        <div style={{ maxWidth:520, margin:'0 auto' }}>
          <motion.div
            initial={{ opacity:0, y:16 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.5 }}
          >
            <p style={{ fontSize:'0.7rem', color:'var(--orange-2)', fontFamily:'var(--font-display)', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:4 }}>
              Dashboard
            </p>
            <h2 style={{ fontSize:'1.6rem', marginBottom:20 }}>
              gm, @{user.username} 👋
            </h2>

            {/* Stats */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
              {[
                { label:'Balance',   val:`${(balance||10000).toLocaleString()} STRK`, highlight:true },
                { label:'Splits',    val: bills.length },
                { label:'Settled',   val: settledCount },
              ].map(({ label, val, highlight }) => (
                <motion.div
                  key={label}
                  initial={{ opacity:0, y:12 }}
                  animate={{ opacity:1, y:0 }}
                  transition={{ delay:0.1 }}
                  className="card"
                  style={{
                    padding:'14px 12px',
                    textAlign:'center',
                    borderColor: highlight ? 'var(--border-o)' : 'var(--border)',
                    background:  highlight ? 'var(--orange-glow)' : 'var(--bg-surface)',
                  }}
                >
                  <p style={{
                    fontSize:   highlight ? '1rem' : '1.3rem',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    color:      highlight ? 'var(--orange-2)' : 'var(--text-100)',
                    marginBottom: 3,
                    lineHeight: 1.2,
                  }}>
                    {val}
                  </p>
                  <p style={{ fontSize:'0.62rem', color:'var(--text-500)', textTransform:'uppercase', letterSpacing:'0.07em', fontFamily:'var(--font-display)', fontWeight:600 }}>
                    {label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div style={{ maxWidth:520, margin:'0 auto', padding:'24px 20px' }}>

        {/* Actions */}
        <motion.div
          initial={{ opacity:0, y:12 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay:0.15 }}
          style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:28 }}
        >
          <Link to="/create" className="btn btn-primary" style={{ justifyContent:'center', padding:'14px', fontSize:'0.9rem', textDecoration:'none' }}>
            ⚡ New Split
          </Link>
          <Link to="/send" className="btn btn-ghost" style={{ justifyContent:'center', padding:'14px', fontSize:'0.9rem', textDecoration:'none' }}>
            ↗ Send STRK
          </Link>
        </motion.div>

        {/* Bills */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
          <label className="label" style={{ margin:0 }}>Your Splits</label>
          {bills.length > 0 && <span style={{ fontSize:'0.7rem', color:'var(--text-500)' }}>{bills.length} total</span>}
        </div>

        {loading ? (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height:110, borderRadius:'var(--r-lg)' }}/>)}
          </div>
        ) : bills.length === 0 ? (
          <motion.div
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            transition={{ delay:0.2 }}
            className="card"
            style={{ padding:'48px 24px', textAlign:'center' }}
          >
            <div style={{ fontSize:'2.5rem', marginBottom:14 }}>🧾</div>
            <h3 style={{ fontSize:'1rem', marginBottom:8 }}>No splits yet</h3>
            <p style={{ fontSize:'0.85rem', marginBottom:24 }}>Create your first split and share it with your group.</p>
            <Link to="/create" className="btn btn-primary" style={{ display:'inline-flex', textDecoration:'none' }}>
              ⚡ Create a Split
            </Link>
          </motion.div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {bills.map((b, i) => <BillCard key={b.id} bill={b} delay={i * 0.05} />)}
          </div>
        )}
      </div>
    </div>
  )
}
  
