import { useState } from 'react';

function formatWA(phone) {
  if (!phone) return null;
  let n = phone.replace(/[\s\-\+\(\)]/g, '');
  if (n.startsWith('00')) n = n.slice(2);
  if (n.startsWith('0')) n = '237' + n.slice(1);
  if (!n.startsWith('237')) n = '237' + n;
  return n;
}

export default function WhatsAppButton({ phone, productName, vendorName, onClose }) {
  const [copied, setCopied] = useState(false);
  const waNum = formatWA(phone);

  const msg = productName
    ? `Bonjour! J'ai vu "${productName}" sur ETOH Market et je suis intéressé(e). Est-il toujours disponible? 🛒`
    : `Bonjour ${vendorName}! J'ai visité votre stand sur ETOH Market et j'aimerais en savoir plus. 🏪`;

  const waUrl = waNum ? `https://wa.me/${waNum}?text=${encodeURIComponent(msg)}` : null;

  function copyNumber() {
    navigator.clipboard.writeText(phone).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="wa-popup-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="wa-popup">
        <div className="wa-popup-logo">💬</div>
        <div className="wa-popup-title">Contact via WhatsApp</div>
        <div className="wa-popup-sub">
          A message about{' '}
          <strong>{productName || vendorName}</strong> will be pre-filled for you.
        </div>

        <div className="wa-popup-number">📞 {phone}</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {waUrl ? (
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="whatsapp-btn">
              <span className="wa-logo">📱</span>
              Open WhatsApp Chat
            </a>
          ) : (
            <div className="alert alert-info">This seller has not set up a WhatsApp number yet.</div>
          )}

          <button
            className="btn btn-outline btn-full"
            onClick={copyNumber}
          >
            {copied ? '✅ Copied!' : '📋 Copy Number'}
          </button>

          <button
            className="btn btn-sm btn-full"
            style={{ background: 'transparent', color: 'var(--text-muted)', border: 'none' }}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
