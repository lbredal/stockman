import { useNavigate } from 'react-router-dom'

const palette = {
  bg: '#0f1117',
  surface: '#1a1d27',
  border: '#2a2d3a',
  accent: '#6ee7b7',
  accentDim: 'rgba(110,231,183,0.12)',
  text: '#e8eaf0',
  muted: '#6b7280',
}

const s = {
  page: {
    minHeight: '100vh',
    background: palette.bg,
    color: palette.text,
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    display: 'flex',
    flexDirection: 'column',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    padding: '1rem 2rem',
    borderBottom: `1px solid ${palette.border}`,
  },
  navLogo: {
    fontSize: '1.15rem',
    fontWeight: 700,
    color: palette.accent,
    margin: 0,
    letterSpacing: '-0.01em',
  },
  navLinks: {
    display: 'flex',
    gap: '1.5rem',
    marginLeft: 'auto',
  },
  navLink: {
    color: palette.muted,
    fontSize: '0.85rem',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  main: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: '1fr 420px',
    gap: '0',
    maxWidth: 1100,
    margin: '0 auto',
    width: '100%',
    padding: '0 2rem',
    alignItems: 'center',
    paddingTop: '4rem',
    paddingBottom: '4rem',
    boxSizing: 'border-box',
  },
  left: {
    paddingRight: '4rem',
  },
  eyebrow: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: palette.accentDim,
    color: palette.accent,
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    padding: '0.3rem 0.85rem',
    borderRadius: '999px',
    marginBottom: '1.5rem',
  },
  h1: {
    fontSize: 'clamp(2rem, 4vw, 3.2rem)',
    fontWeight: 800,
    margin: '0 0 1rem',
    lineHeight: 1.12,
    letterSpacing: '-0.03em',
  },
  accent: {
    color: palette.accent,
  },
  desc: {
    color: palette.muted,
    fontSize: '1rem',
    lineHeight: 1.6,
    maxWidth: 420,
    margin: '0 0 2.5rem',
  },
  statRow: {
    display: 'flex',
    gap: '2rem',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.15rem',
  },
  statNum: {
    fontSize: '1.6rem',
    fontWeight: 700,
    color: palette.accent,
  },
  statLabel: {
    fontSize: '0.78rem',
    color: palette.muted,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  panel: {
    background: palette.surface,
    border: `1px solid ${palette.border}`,
    borderRadius: 16,
    padding: '2rem',
  },
  panelTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    margin: '0 0 0.25rem',
  },
  panelSub: {
    fontSize: '0.82rem',
    color: palette.muted,
    margin: '0 0 1.75rem',
  },
  fieldGroup: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    fontSize: '0.78rem',
    color: palette.muted,
    marginBottom: '0.3rem',
    letterSpacing: '0.03em',
  },
  input: {
    width: '100%',
    padding: '0.65rem 0.85rem',
    background: palette.bg,
    border: `1px solid ${palette.border}`,
    borderRadius: 8,
    color: palette.text,
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box',
  },
  forgotRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '1.25rem',
  },
  forgot: {
    fontSize: '0.78rem',
    color: palette.muted,
    cursor: 'pointer',
  },
  btn: {
    width: '100%',
    padding: '0.75rem',
    background: palette.accent,
    color: '#0f1117',
    border: 'none',
    borderRadius: 8,
    fontSize: '0.95rem',
    fontWeight: 700,
    cursor: 'pointer',
    letterSpacing: '0.01em',
  },
  orDivider: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    margin: '1.25rem 0',
    color: palette.border,
    fontSize: '0.78rem',
  },
  orLine: {
    flex: 1,
    height: 1,
    background: palette.border,
  },
  requestBtn: {
    width: '100%',
    padding: '0.7rem',
    background: 'transparent',
    border: `1px solid ${palette.border}`,
    color: palette.muted,
    borderRadius: 8,
    fontSize: '0.88rem',
    cursor: 'pointer',
  },
}

export default function LandingC() {
  const navigate = useNavigate()

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <h1 style={s.navLogo}>⬡ Stockman</h1>
        <div style={s.navLinks}>
          <a style={s.navLink}>Features</a>
          <a style={s.navLink}>Pricing</a>
          <a style={s.navLink}>Docs</a>
        </div>
      </nav>

      <main style={s.main}>
        <div style={s.left}>
          <div style={s.eyebrow}>✦ Inventory platform</div>
          <h2 style={s.h1}>
            Your produce.<br />
            <span style={s.accent}>Your numbers.</span>
          </h2>
          <p style={s.desc}>
            Stockman gives small producers full visibility over batches, stock levels,
            and sell-through — without the enterprise overhead.
          </p>
          <div style={s.statRow}>
            <div style={s.stat}>
              <span style={s.statNum}>100%</span>
              <span style={s.statLabel}>Tenant isolated</span>
            </div>
            <div style={s.stat}>
              <span style={s.statNum}>Real-time</span>
              <span style={s.statLabel}>Batch tracking</span>
            </div>
            <div style={s.stat}>
              <span style={s.statNum}>Multi-user</span>
              <span style={s.statLabel}>Per producer</span>
            </div>
          </div>
        </div>

        <div style={s.panel}>
          <p style={s.panelTitle}>Sign in</p>
          <p style={s.panelSub}>Access your producer dashboard</p>

          <div style={s.fieldGroup}>
            <label style={s.label}>Email</label>
            <input style={s.input} type="email" placeholder="you@example.com" />
          </div>
          <div style={s.fieldGroup}>
            <label style={s.label}>Password</label>
            <input style={s.input} type="password" placeholder="••••••••" />
          </div>

          <div style={s.forgotRow}>
            <span style={s.forgot}>Forgot password?</span>
          </div>

          <button style={s.btn}>Sign in →</button>

          <div style={s.orDivider}>
            <span style={s.orLine} /><span style={{ color: palette.muted }}>or</span><span style={s.orLine} />
          </div>

          <button style={s.requestBtn}>Request producer access</button>

          <button
            onClick={() => navigate('/dashboard')}
            style={{ ...s.requestBtn, marginTop: '0.5rem', borderColor: 'rgba(251,191,36,0.3)', color: '#fbbf24' }}
          >
            ⚡ Dev login (bypass auth)
          </button>
        </div>
      </main>
    </div>
  )
}
