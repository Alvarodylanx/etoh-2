import { useState } from 'react';
import { useLang } from '../context/LanguageContext';

export default function BendskinButton({ productName, vendorName, priceCfa, city }) {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState('');

  function buildLink() {
    const price = Number(priceCfa).toLocaleString();
    const msg = lang === 'fr'
      ? `🛵 *Demande de Livraison Bendskin — ETOH Market*\n\n📦 Produit : ${productName}\n🏪 Vendeur : ${vendorName} (${city})\n💰 Prix : ${price} CFA\n🏠 Livrer à : ${address || '[votre adresse]'}\n\nPouvez-vous assurer cette livraison ? Combien prenez-vous ?`
      : `🛵 *Bendskin Delivery Request — ETOH Market*\n\n📦 Product: ${productName}\n🏪 Vendor: ${vendorName} (${city})\n💰 Price: ${price} CFA\n🏠 Deliver to: ${address || '[your address]'}\n\nCan you handle this delivery? What's your rate?`;
    return `https://wa.me/?text=${encodeURIComponent(msg)}`;
  }

  const label     = lang === 'fr' ? 'Livraison Bendskin 🛵'       : 'Bendskin Delivery 🛵';
  const sublabel  = lang === 'fr' ? 'Envoyer à votre livreur'      : 'Send to your delivery rider';
  const addrLabel = lang === 'fr' ? 'Votre adresse de livraison'   : 'Your delivery address';
  const addrPh    = lang === 'fr' ? 'ex: Bonanjo, près de Total...' : 'e.g. Akwa, near Total station...';
  const sendLabel = lang === 'fr' ? '📲 Ouvrir WhatsApp'           : '📲 Open WhatsApp';
  const hint      = lang === 'fr'
    ? 'Choisissez votre bendskin dans vos contacts WhatsApp'
    : 'Pick your bendskin rider from your WhatsApp contacts';

  return (
    <div className="bendskin-wrap">
      <button className="bendskin-btn" onClick={() => setOpen(o => !o)}>
        🛵 {label}
      </button>

      {open && (
        <div className="bendskin-panel">
          <div className="bendskin-panel-title">{sublabel}</div>
          <div className="form-group" style={{ marginBottom: 10 }}>
            <label className="form-label" style={{ fontSize: '.82rem' }}>{addrLabel}</label>
            <input
              className="form-input"
              style={{ fontSize: '.88rem', padding: '9px 12px' }}
              placeholder={addrPh}
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
          </div>
          <a
            href={buildLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="bendskin-send"
          >
            {sendLabel}
          </a>
          <div className="bendskin-hint">{hint}</div>
        </div>
      )}
    </div>
  );
}
