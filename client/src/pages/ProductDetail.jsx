import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct, placeOrder } from '../api';
import { useAuth } from '../context/AuthContext';
import { getCategoryMeta } from '../constants/categories';
import SafetyGate from '../components/SafetyGate';
import WhatsAppButton from '../components/WhatsAppButton';

const CITIES = ['Douala', 'Yaoundé', 'Bamenda', 'Buea', 'Bafoussam', 'Kribi', 'Limbe', 'Ngaoundéré'];

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showGate, setShowGate] = useState(false);
  const [showWA, setShowWA] = useState(false);
  const [orderForm, setOrderForm] = useState({ buyer_name: '', target_city: '', target_quarter: '', near_landmark: '' });
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState('');
  const [orderError, setOrderError] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getProduct(id).then((r) => setProduct(r.data)).catch(() => setError('Product not found.')).finally(() => setLoading(false));
  }, [id]);

  function onChange(e) { setOrderForm((f) => ({ ...f, [e.target.name]: e.target.value })); }

  async function onOrder(e) {
    e.preventDefault();
    const { buyer_name, target_city, target_quarter, near_landmark } = orderForm;
    if (!buyer_name || !target_city || !target_quarter || !near_landmark) { setOrderError('Please fill all delivery fields.'); return; }
    setOrderLoading(true); setOrderError('');
    try {
      const res = await placeOrder({ product_id: id, ...orderForm });
      setOrderSuccess(res.data.message);
      setOrderForm({ buyer_name: '', target_city: '', target_quarter: '', near_landmark: '' });
    } catch (err) {
      setOrderError(err.response?.data?.error || 'Failed to place order.');
    } finally { setOrderLoading(false); }
  }

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (error)   return <div className="page"><div className="alert alert-error">{error}</div></div>;

  const cat = getCategoryMeta(product.category);

  return (
    <div className="page">
      {showGate && (
        <SafetyGate phone={product.phone_number} vendorName={product.vendor_name} onClose={() => { setShowGate(false); setShowWA(true); }} />
      )}
      {showWA && (
        <WhatsAppButton phone={product.phone_number} productName={product.product_name} vendorName={product.vendor_name} onClose={() => setShowWA(false)} />
      )}

      <div className="breadcrumb">
        <Link to="/">Market</Link> ›
        <Link to={`/stands/${product.stand_id}`}>{product.vendor_name}</Link> ›
        <span>{product.product_name}</span>
      </div>

      <div className="product-detail">
        {/* Left: Media */}
        <div>
          {product.image_path ? (
            <img src={product.image_path} alt={product.product_name}
              style={{ width: '100%', borderRadius: 'var(--radius)', maxHeight: '380px', objectFit: 'cover', marginBottom: '16px' }}
              onError={(e) => { e.target.style.display='none'; }}
            />
          ) : (
            <div style={{ width:'100%', height:'280px', borderRadius:'var(--radius)', background:'linear-gradient(135deg,#f3f4f6,#e5e7eb)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'5rem', marginBottom:'16px' }}>🛍️</div>
          )}

          {product.video_path && (
            <div style={{ marginBottom: '16px' }}>
              <div className="section-title" style={{ marginBottom: '8px' }}>🎬 Product Video</div>
              <video className="product-video" controls src={product.video_path} />
            </div>
          )}

          {product.audio_voice_path && (
            <div className="card" style={{ padding: '16px' }}>
              <div style={{ fontWeight: 700, marginBottom: '8px' }}>🎙️ Bayam-Sellam Voice Note</div>
              <p style={{ fontSize: '.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Listen to the seller describe this product.</p>
              <audio className="audio-player" controls src={product.audio_voice_path} />
            </div>
          )}
        </div>

        {/* Right: Info + Actions */}
        <div>
          <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
            <div style={{ marginBottom: '10px' }}>
              <span className="cat-badge">{cat.icon} {cat.label}</span>
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '10px' }}>{product.product_name}</h1>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary-dark)', marginBottom: '18px' }}>
              {Number(product.price_cfa).toLocaleString()} <span style={{ fontSize: '1rem', fontWeight: 600 }}>CFA</span>
            </div>

            <div style={{ display:'flex', alignItems:'center', gap:'12px', padding:'12px', background:'var(--primary-light)', borderRadius:'var(--radius-sm)', marginBottom:'18px' }}>
              <span style={{ fontSize: '1.5rem' }}>🏪</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '.95rem' }}>{product.vendor_name}</div>
                <div style={{ fontSize: '.82rem', color: 'var(--text-muted)' }}>{product.stand_description}</div>
              </div>
            </div>

            {/* Primary CTA — triggers safety gate then WhatsApp */}
            <button className="btn btn-red btn-full" style={{ marginBottom: '10px', padding: '13px' }} onClick={() => setShowGate(true)}>
              📞 Contact Seller Safely
            </button>

            {/* Direct WhatsApp shortcut */}
            <button
              className="whatsapp-btn btn-full"
              style={{ width: '100%', justifyContent: 'center', fontSize: '.95rem', padding: '12px' }}
              onClick={() => setShowWA(true)}
            >
              <span className="wa-logo">📱</span> Chat on WhatsApp
            </button>

            <p style={{ fontSize: '.76rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '8px' }}>
              Always meet in public. Never pay before inspecting.
            </p>
          </div>

          {/* Order Form */}
          <div className="order-form">
            <h3>🛵 Request Delivery</h3>
            {orderSuccess && <div className="alert alert-success">✅ {orderSuccess}</div>}
            {orderError   && <div className="alert alert-error">⚠️ {orderError}</div>}
            <form onSubmit={onOrder}>
              <div className="form-group">
                <label className="form-label">Your Full Name</label>
                <input className="form-input" name="buyer_name" value={orderForm.buyer_name} onChange={onChange} placeholder="e.g. Paul Biya Mvondo" />
              </div>
              <div className="form-group">
                <label className="form-label">Delivery City</label>
                <div className="city-chips">
                  {CITIES.map((c) => (
                    <button key={c} type="button" className={`city-chip ${orderForm.target_city === c ? 'selected' : ''}`} onClick={() => setOrderForm((f) => ({ ...f, target_city: c }))}>{c}</button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Quarter / Neighbourhood</label>
                <input className="form-input" name="target_quarter" value={orderForm.target_quarter} onChange={onChange} placeholder="e.g. Bastos, Akwa, Bonanjo..." />
              </div>
              <div className="form-group">
                <label className="form-label">Nearest Landmark</label>
                <input className="form-input" name="near_landmark" value={orderForm.near_landmark} onChange={onChange} placeholder="e.g. Opposite Total Energies Station" />
                <div className="form-hint">Be specific so the delivery rider finds you easily!</div>
              </div>
              <button className="btn btn-green btn-full" type="submit" disabled={orderLoading}>
                {orderLoading ? 'Placing order...' : '🛵 Place Order'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
