import { useState } from 'react';
import { setAvailability } from '../api';
import { useLang } from '../context/LanguageContext';

const META = {
  open:   { dot: '🟢', en: 'Open Now',   fr: 'Ouvert',          color: '#059669', bg: '#ecfdf5', border: '#6ee7b7' },
  away:   { dot: '🟡', en: 'Back Soon',  fr: 'Revient bientôt', color: '#d97706', bg: '#fffbeb', border: '#fcd34d' },
  closed: { dot: '🔴', en: 'Closed',     fr: 'Fermé',           color: '#dc2626', bg: '#fef2f2', border: '#fca5a5' },
};

export function AvailabilityBadge({ availability = 'open', size = 'sm' }) {
  const { lang } = useLang();
  const m = META[availability] || META.open;
  const fontSize = size === 'lg' ? '.88rem' : '.72rem';
  const padding  = size === 'lg' ? '4px 12px' : '2px 8px';

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: m.bg, color: m.color,
      border: `1px solid ${m.border}`,
      borderRadius: 999, padding, fontSize, fontWeight: 700, whiteSpace: 'nowrap',
    }}>
      {m.dot} {lang === 'fr' ? m.fr : m.en}
    </span>
  );
}

/* Owner-only toggle — shows 3 buttons to switch status */
export function AvailabilityToggle({ standId, current = 'open', onChange }) {
  const { lang } = useLang();
  const [value,   setValue]   = useState(current);
  const [loading, setLoading] = useState(false);

  async function pick(next) {
    if (next === value || loading) return;
    setLoading(true);
    try {
      await setAvailability(standId, next);
      setValue(next);
      if (onChange) onChange(next);
    } catch {}
    finally { setLoading(false); }
  }

  const label = lang === 'fr' ? 'Statut du Stand' : 'Stand Status';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.5px' }}>
        {label}
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {Object.entries(META).map(([key, m]) => (
          <button
            key={key}
            onClick={() => pick(key)}
            disabled={loading}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '6px 12px', borderRadius: 999, fontSize: '.8rem', fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              border: `2px solid ${m.border}`,
              background: value === key ? m.color : m.bg,
              color:      value === key ? 'white'  : m.color,
              transition: 'all .15s',
            }}
          >
            {m.dot} {lang === 'fr' ? m.fr : m.en}
          </button>
        ))}
      </div>
    </div>
  );
}
