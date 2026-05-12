import { Link, useLocation, Outlet } from 'react-router-dom'

const NAV = [
  { to: '/dashboard',        label: 'Lager',        icon: '▦' },
  { to: '/update-inventory', label: 'Oppdater lager', icon: '✎' },
  { to: '/waiting-game',     label: 'Waiting Game',  icon: '▶' },
]

const c = {
  bg: '#0f1117', surface: '#1a1d27', border: '#2a2d3a',
  accent: '#6ee7b7', accentDim: 'rgba(110,231,183,0.08)', muted: '#6b7280',
  text: '#e8eaf0',
}

export default function AppLayout() {
  const { pathname } = useLocation()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: c.bg, color: c.text, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <aside style={{ width: 196, flexShrink: 0, borderRight: `1px solid ${c.border}`, display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh' }}>
        <div style={{ padding: '1.4rem 1.25rem', borderBottom: `1px solid ${c.border}` }}>
          <span style={{ fontSize: '1.05rem', fontWeight: 700, color: c.accent, letterSpacing: '-0.01em' }}>⬡ Stockman</span>
        </div>

        <nav style={{ flex: 1, padding: '0.75rem 0' }}>
          {NAV.map(({ to, label, icon }) => {
            const active = pathname === to
            return (
              <Link key={to} to={to} style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                padding: '0.6rem 1.25rem', textDecoration: 'none',
                color: active ? c.accent : c.muted,
                background: active ? c.accentDim : 'transparent',
                borderLeft: `2px solid ${active ? c.accent : 'transparent'}`,
                fontSize: '0.85rem', fontWeight: active ? 600 : 400,
                transition: 'color 0.15s',
              }}>
                <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>{icon}</span>
                {label}
              </Link>
            )
          })}
        </nav>

        <div style={{ padding: '1rem 1.25rem', borderTop: `1px solid ${c.border}`, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <span style={{ background: c.accentDim, color: c.accent, fontSize: '0.7rem', fontWeight: 600, padding: '0.25rem 0.6rem', borderRadius: '999px', textAlign: 'center', border: `1px solid rgba(110,231,183,0.15)` }}>
            Bredal Sennep
          </span>
          <span style={{ background: 'rgba(251,191,36,0.1)', color: '#fbbf24', fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: 6, textAlign: 'center', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
            Dev
          </span>
        </div>
      </aside>

      <main style={{ flex: 1, minWidth: 0 }}>
        <Outlet />
      </main>
    </div>
  )
}
