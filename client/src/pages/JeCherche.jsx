import { useState, useEffect } from 'react';
import { useLang } from '../context/LanguageContext';

const CITIES = ['Douala','Yaoundé','Bamenda','Buea','Bafoussam','Kribi','Limbe','Ngaoundéré'];

const api = {
  get:  (city) => fetch('/api/wanted' + (city ? `?city=${encodeURIComponent(city)}` : '')).then(r => r.json()),
  post: (data) => fetch('/api/wanted', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) }).then(async r => { const d = await r.json(); if (!r.ok) throw new Error(d.error); return d; }),
  del:  (id, whatsapp) => fetch(`/api/wanted/${id}`, { method:'DELETE', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ whatsapp }) }).then(async r => { const d = await r.json(); if (!r.ok) throw new Error(d.error); return d; }),
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function daysLeft(expiresAt) {
  const d = Math.ceil((new Date(expiresAt) - Date.now()) / 86400000);
  return Math.max(0, d);
}

function waLink(number, name, description, city) {
  const clean = number.replace(/\D/g, '');
  const dial  = clean.startsWith('237') ? clean : '237' + clean;
  const msg   = `Bonjour ${name} ! J'ai vu votre annonce sur ETOH Market.\nVous cherchez : ${description} (${city})\nJe peux vous aider ! 🤝`;
  return `https://wa.me/${dial}?text=${encodeURIComponent(msg)}`;
}

export default function JeCherche() {
  const { lang } = useLang();
  const fr = lang === 'fr';

  const T = {
    title:       fr ? 'Je Cherche'                                   : "I'm Looking For",
    subtitle:    fr ? 'Postez ce que vous cherchez — les vendeurs vous contacteront directement sur WhatsApp.'
                    : 'Post what you need — vendors will contact you directly on WhatsApp.',
    postBtn:     fr ? '+ Publier une Annonce'                       : '+ Post a Request',
    cityFilter:  fr ? 'Toutes les Villes'                           : 'All Cities',
    formTitle:   fr ? 'Que cherchez-vous ?'                         : 'What are you looking for?',
    nameLabel:   fr ? 'Votre Prénom *'                              : 'Your First Name *',
    descLabel:   fr ? 'Décrivez ce que vous cherchez *'             : 'Describe what you need *',
    descPh:      fr ? 'ex: 20 kg de maïs frais, qualité supérieure' : 'e.g. 20 kg fresh maize, good quality',
    qtyLabel:    fr ? 'Quantité (optionnel)'                        : 'Quantity (optional)',
    qtyPh:       fr ? 'ex: 5 kg, 2 régimes, 1 carton...'           : 'e.g. 5 kg, 2 bunches, 1 box...',
    cityLabel:   fr ? 'Votre Ville *'                               : 'Your City *',
    waLabel:     fr ? 'Votre Numéro WhatsApp *'                     : 'Your WhatsApp Number *',
    waPh:        fr ? '6XX XX XX XX'                                : '6XX XX XX XX',
    waHint:      fr ? 'Visible uniquement des vendeurs — ils vous contacteront.'
                    : 'Only visible to vendors — they will contact you.',
    submitBtn:   fr ? 'Publier ma Recherche'                          : 'Post My Request',
    submitting:  fr ? 'Publication...'                              : 'Posting...',
    empty:       fr ? 'Aucune annonce pour le moment.'              : 'No requests yet.',
    emptyHint:   fr ? 'Soyez le premier à poster ce que vous cherchez !'
                    : 'Be the first to post what you\'re looking for!',
    contactBtn:  fr ? 'Contacter sur WhatsApp'                        : 'Contact on WhatsApp',
    daysLeft:    (d) => fr ? `Expire dans ${d}j`                    : `Expires in ${d}d`,
    removeBtn:   fr ? 'Retirer'                                       : 'Remove',
    removePrompt:fr ? 'Entrez votre numéro WhatsApp pour supprimer cette annonce :'
                    : 'Enter your WhatsApp number to remove this post:',
    removed:     fr ? 'Annonce retirée.'                            : 'Post removed.',
    posted:      fr ? 'Annonce publiée ! Les vendeurs vont vous contacter.'
                    : 'Request posted! Vendors will contact you.',
    lookingFor:  fr ? 'Recherche'                                   : 'Looking for',
    qty:         fr ? 'Quantité'                                    : 'Quantity',
    howTitle:    fr ? 'Comment ça marche'                             : 'How it works',
    howText:     fr
      ? '1. Postez ce que vous cherchez avec votre numéro WhatsApp.\n2. Les vendeurs voient votre annonce et vous contactent directement.\n3. Négociez et concluez l\'affaire en toute sécurité.\n⏰ Les annonces expirent automatiquement après 7 jours.'
      : '1. Post what you need with your WhatsApp number.\n2. Vendors see your request and contact you directly.\n3. Negotiate and close the deal safely.\n⏰ Posts expire automatically after 7 days.',
  };

  const [posts,    setPosts]    = useState([]);
  const [city,     setCity]     = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading,  setLoading]  = useState(true);
  const [submitting, setSub]    = useState(false);
  const [success,  setSuccess]  = useState('');
  const [error,    setError]    = useState('');
  const [form,     setForm]     = useState({ buyer_name:'', description:'', quantity:'', city:'Douala', whatsapp:'' });

  const load = (c = city) => {
    setLoading(true);
    api.get(c).then(setPosts).catch(() => setPosts([])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { load(city); }, [city]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSub(true); setError('');
    try {
      await api.post(form);
      setSuccess(T.posted);
      setShowForm(false);
      setForm({ buyer_name:'', description:'', quantity:'', city:'Douala', whatsapp:'' });
      load();
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) { setError(err.message); }
    finally { setSub(false); }
  }

  async function handleRemove(post) {
    const wa = window.prompt(T.removePrompt);
    if (!wa) return;
    try {
      await api.del(post.id, wa.trim());
      setPosts(prev => prev.filter(p => p.id !== post.id));
      alert(T.removed);
    } catch (err) { alert(err.message); }
  }

  return (
    <div className="page">
      {/* Header */}
      <div className="jc-header">
        <div>
          <h1 className="page-title">{T.title}</h1>
          <p className="page-subtitle">{T.subtitle}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(s => !s)}>
          {showForm ? '✕' : T.postBtn}
        </button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}

      {/* Post form */}
      {showForm && (
        <div className="jc-form-wrap">
          <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: 18 }}>{T.formTitle}</div>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              <div className="form-group">
                <label className="form-label">{T.nameLabel}</label>
                <input className="form-input" value={form.buyer_name} onChange={e => setForm(f => ({...f, buyer_name: e.target.value}))} placeholder="ex: Josephine" required />
              </div>
              <div className="form-group">
                <label className="form-label">{T.cityLabel}</label>
                <select className="form-select" value={form.city} onChange={e => setForm(f => ({...f, city: e.target.value}))} required>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">{T.descLabel}</label>
              <textarea className="form-textarea" style={{ minHeight: 80 }} value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} placeholder={T.descPh} required />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              <div className="form-group">
                <label className="form-label">{T.qtyLabel}</label>
                <input className="form-input" value={form.quantity} onChange={e => setForm(f => ({...f, quantity: e.target.value}))} placeholder={T.qtyPh} />
              </div>
              <div className="form-group">
                <label className="form-label">{T.waLabel}</label>
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <span style={{ background:'#f3f4f6', padding:'10px 12px', borderRadius:'var(--radius-sm)', fontWeight:700, border:'2px solid var(--border)', fontSize:'.9rem' }}>+237</span>
                  <input className="form-input" value={form.whatsapp} onChange={e => setForm(f => ({...f, whatsapp: e.target.value}))} placeholder={T.waPh} style={{ flex:1 }} required />
                </div>
                <div className="form-hint">{T.waHint}</div>
              </div>
            </div>
            <button className="btn btn-primary btn-full" disabled={submitting} style={{ padding: 12 }}>
              {submitting ? T.submitting : T.submitBtn}
            </button>
          </form>
        </div>
      )}

      {/* City filter */}
      <div className="cat-bar" style={{ marginBottom: 20 }}>
        <button className={`cat-chip ${city==='' ? 'active' : ''}`} onClick={() => setCity('')}>{T.cityFilter}</button>
        {CITIES.map(c => <button key={c} className={`cat-chip ${city===c ? 'active' : ''}`} onClick={() => setCity(c)}>{c}</button>)}
      </div>

      {/* Posts grid */}
      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon" style={{ fontSize: '2rem', color: 'var(--border)' }}>◫</div>
          <h3>{T.empty}</h3>
          <p>{T.emptyHint}</p>
          <button className="btn btn-primary" style={{ marginTop:16 }} onClick={() => setShowForm(true)}>{T.postBtn}</button>
        </div>
      ) : (
        <div className="jc-grid">
          {posts.map(post => (
            <div key={post.id} className="jc-card">
              <div className="jc-card-top">
                <div className="jc-avatar">{post.buyer_name.charAt(0).toUpperCase()}</div>
                <div className="jc-meta">
                  <div className="jc-buyer">{post.buyer_name}</div>
                  <div className="jc-city">{post.city}</div>
                </div>
                <div className="jc-time">{timeAgo(post.created_at)}</div>
              </div>

              <div className="jc-looking">{T.lookingFor}:</div>
              <div className="jc-desc">{post.description}</div>

              {post.quantity && (
                <div className="jc-qty">{T.qty}: <strong>{post.quantity}</strong></div>
              )}

              <div className="jc-footer">
                <span className="jc-expiry">{T.daysLeft(daysLeft(post.expires_at))}</span>
                <div style={{ display:'flex', gap:8 }}>
                  <a
                    href={waLink(post.whatsapp, post.buyer_name, post.description, post.city)}
                    target="_blank" rel="noopener noreferrer"
                    className="btn btn-green btn-sm"
                    style={{ fontSize:'.82rem', padding:'6px 14px' }}
                  >
                    {T.contactBtn}
                  </a>
                  <button
                    className="btn btn-sm"
                    style={{ background:'#fee2e2', color:'#dc2626', border:'none', fontSize:'.78rem', padding:'6px 10px', cursor:'pointer', borderRadius:'var(--radius-sm)' }}
                    onClick={() => handleRemove(post)}
                  >
                    {T.removeBtn}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* How it works */}
      <div className="prix-info-box" style={{ marginTop: 32 }}>
        <div className="prix-info-title">{T.howTitle}</div>
        <p style={{ whiteSpace:'pre-line' }}>{T.howText}</p>
      </div>
    </div>
  );
}
