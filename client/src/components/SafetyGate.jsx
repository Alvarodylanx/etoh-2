import { useState } from 'react';

const RULES = [
  { icon: '🚫', text: 'Never send mobile money or cash before physically inspecting and receiving the goods.' },
  { icon: '📍', text: 'Always arrange meetings at busy public places — near a petrol station, church, bakery, or bank.' },
  { icon: '📱', text: 'Double-check all payment confirmation SMS codes carefully. Ignore any link sent by strangers.' },
];

export default function SafetyGate({ phone, vendorName, onClose }) {
  const [checked, setChecked] = useState(false);
  const [revealed, setRevealed] = useState(false);

  function handleReveal() {
    if (checked) setRevealed(true);
  }

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="safety-modal">
        <h2>⚠️ Before You Contact the Seller</h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
          Read these safety rules carefully before revealing <strong>{vendorName}'s</strong> contact.
        </p>

        {RULES.map((rule, i) => (
          <div className="safety-rule" key={i}>
            <span className="safety-rule-icon">{rule.icon}</span>
            <span>{rule.text}</span>
          </div>
        ))}

        {!revealed ? (
          <>
            <label className="safety-checkbox-row">
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
              />
              <span className="safety-checkbox-label">
                I have read and fully understand all the safety guidelines above.
              </span>
            </label>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn btn-red btn-full"
                onClick={handleReveal}
                disabled={!checked}
              >
                Reveal Seller Contact
              </button>
              <button className="btn btn-outline btn-sm" onClick={onClose}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div className="contact-reveal">
            <div className="contact-label">📞 {vendorName}'s Contact</div>
            <div className="contact-number">{phone}</div>
            <div className="contact-label" style={{ marginTop: '8px' }}>
              Stay safe — meet in public, inspect before paying.
            </div>
            <button className="btn btn-outline btn-sm" style={{ marginTop: '12px' }} onClick={onClose}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
