import { useEffect, useState } from 'react'

const palette = {
  bg: '#0f1117',
  surface: '#1a1d27',
  surfaceHigh: '#22263a',
  border: '#2a2d3a',
  accent: '#6ee7b7',
  accentDim: 'rgba(110,231,183,0.12)',
  text: '#e8eaf0',
  muted: '#6b7280',
  available: '#6ee7b7',
  reserved: '#fbbf24',
  sold: '#6b7280',
}

const statusColor = { available: palette.available, reserved: palette.reserved, sold: palette.sold }
const statusLabel = { available: 'Tilgjengelig', reserved: 'Reservert', sold: 'Solgt' }

function fmt(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('nb-NO', { day: '2-digit', month: 'short', year: 'numeric' })
}

const s = {
  page: { minHeight: '100vh', background: palette.bg, color: palette.text, fontFamily: "'Segoe UI', system-ui, sans-serif" },
  nav: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 2rem', borderBottom: `1px solid ${palette.border}` },
  logo: { fontSize: '1.1rem', fontWeight: 700, color: palette.accent, margin: 0 },
  tenantBadge: { background: palette.accentDim, color: palette.accent, fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.75rem', borderRadius: '999px', letterSpacing: '0.04em' },
  devBadge: { marginLeft: 'auto', background: 'rgba(251,191,36,0.12)', color: '#fbbf24', fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: 6, letterSpacing: '0.06em', textTransform: 'uppercase' },
  body: { maxWidth: 1000, margin: '0 auto', padding: '2.5rem 2rem' },
  heading: { fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.25rem' },
  sub: { color: palette.muted, fontSize: '0.88rem', margin: '0 0 2rem' },
  statsRow: { display: 'flex', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap' },
  statCard: { background: palette.surface, border: `1px solid ${palette.border}`, borderRadius: 12, padding: '1rem 1.5rem', minWidth: 140 },
  statNum: { fontSize: '1.8rem', fontWeight: 700, color: palette.accent },
  statLabel: { fontSize: '0.75rem', color: palette.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 },
  productCard: { background: palette.surface, border: `1px solid ${palette.border}`, borderRadius: 12, marginBottom: '1.25rem', overflow: 'hidden' },
  productHeader: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.5rem', borderBottom: `1px solid ${palette.border}` },
  productName: { fontWeight: 600, fontSize: '1rem', margin: 0 },
  productDesc: { color: palette.muted, fontSize: '0.8rem', marginTop: 2 },
  categoryTag: { marginLeft: 'auto', background: palette.accentDim, color: palette.accent, fontSize: '0.72rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: 6 },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '0.6rem 1.5rem', textAlign: 'left', fontSize: '0.72rem', color: palette.muted, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `1px solid ${palette.border}` },
  td: { padding: '0.75rem 1.5rem', fontSize: '0.88rem', borderBottom: `1px solid ${palette.border}` },
  statusPill: (status) => ({ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: `rgba(${status === 'available' ? '110,231,183' : status === 'reserved' ? '251,191,36' : '107,114,128'},0.12)`, color: statusColor[status], fontSize: '0.78rem', fontWeight: 600, padding: '0.2rem 0.65rem', borderRadius: '999px' }),
  dot: (status) => ({ width: 6, height: 6, borderRadius: '50%', background: statusColor[status], flexShrink: 0 }),
  emptyBatches: { padding: '1.5rem', color: palette.muted, fontSize: '0.85rem', textAlign: 'center' },
  error: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: 10, padding: '1rem 1.5rem', marginBottom: '1.5rem', fontSize: '0.88rem' },
}

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/dev/inventory')
      .then(r => r.ok ? r.json() : r.json().then(b => Promise.reject(b.error)))
      .then(setData)
      .catch(e => setError(String(e)))
  }, [])

  if (!data && !error) {
    return <div style={{ ...s.page, display: 'flex', alignItems: 'center', justifyContent: 'center', color: palette.muted }}>Laster...</div>
  }

  const available = data?.products.flatMap(p => p.batches).filter(b => b.status === 'available').reduce((sum, b) => sum + b.quantity, 0) ?? 0
  const reserved = data?.products.flatMap(p => p.batches).filter(b => b.status === 'reserved').reduce((sum, b) => sum + b.quantity, 0) ?? 0
  const totalBatches = data?.products.flatMap(p => p.batches).length ?? 0

  return (
    <div style={s.page}>
<div style={s.body}>
        {error && <div style={s.error}>Kunne ikke laste data — kjør seed-filen først.<br /><small>{error}</small></div>}

        {data && <>
          <h2 style={s.heading}>{data.tenant.name}</h2>
          <p style={s.sub}>Oversikt over alle produkter og partier</p>

          <div style={s.statsRow}>
            <div style={s.statCard}><div style={s.statNum}>{data.products.length}</div><div style={s.statLabel}>Produkter</div></div>
            <div style={s.statCard}><div style={s.statNum}>{totalBatches}</div><div style={s.statLabel}>Partier totalt</div></div>
            <div style={s.statCard}><div style={{ ...s.statNum, color: palette.available }}>{available}</div><div style={s.statLabel}>Glass tilgjengelig</div></div>
            <div style={s.statCard}><div style={{ ...s.statNum, color: palette.reserved }}>{reserved}</div><div style={s.statLabel}>Glass reservert</div></div>
          </div>

          {data.products.map(product => (
            <div key={product.id} style={s.productCard}>
              <div style={s.productHeader}>
                {product.imageUrl && <img src={product.imageUrl} alt={product.name} style={{ width: 52, height: 52, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />}
                <div>
                  <p style={s.productName}>{product.name}</p>
                  {product.description && <p style={s.productDesc}>{product.description}</p>}
                </div>
                <span style={s.categoryTag}>{product.category}</span>
              </div>

              {product.batches.length === 0
                ? <div style={s.emptyBatches}>Ingen partier registrert</div>
                : <table style={s.table}>
                    <thead>
                      <tr>
                        <th style={s.th}>Status</th>
                        <th style={s.th}>Antall</th>
                        <th style={s.th}>Høstet</th>
                        <th style={s.th}>Utløper</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.batches.map((batch, i) => (
                        <tr key={batch.id} style={i === product.batches.length - 1 ? { ...s.td, borderBottom: 'none' } : {}}>
                          <td style={s.td}>
                            <span style={s.statusPill(batch.status)}>
                              <span style={s.dot(batch.status)} />
                              {statusLabel[batch.status]}
                            </span>
                          </td>
                          <td style={s.td}>{batch.quantity} {batch.unitAbbreviation}</td>
                          <td style={s.td}>{fmt(batch.harvestDate)}</td>
                          <td style={s.td}>{fmt(batch.expiryDate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
              }
            </div>
          ))}
        </>}
      </div>
    </div>
  )
}
