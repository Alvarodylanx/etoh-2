import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStand, deleteProduct } from '../api';
import { useAuth } from '../context/AuthContext';
import SafetyGate from '../components/SafetyGate';
import WhatsAppButton from '../components/WhatsAppButton';
import ProductCard from '../components/ProductCard';

export default function StandDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showGate, setShowGate] = useState(false);
  const [showWA, setShowWA] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getStand(id).then((r) => setData(r.data)).catch(() => setError('Stand not found.')).finally(() => setLoading(false));
  }, [id]);

  async function handleDeleteProduct(product) {
    if (!window.confirm(`Delete "${product.product_name}"?`)) return;
    setDeletingId(product.id);
    try {
      await deleteProduct(product.id);
      setData((prev) => ({ ...prev, products: prev.products.filter((p) => p.id !== product.id) }));
    } catch (err) { alert(err.response?.data?.error || 'Failed to delete.'); }
    finally { setDeletingId(null); }
  }

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (error)   return <div className="page"><div className="alert alert-error">{error}</div></div>;

  const { stand, products } = data;
  const isOwner = user && stand.user_id === user.id;

  return (
    <div className="page">
      {showGate && <SafetyGate phone={stand.phone_number} vendorName={stand.vendor_name} onClose={() => { setShowGate(false); setShowWA(true); }} />}
      {showWA   && <WhatsAppButton phone={stand.phone_number} vendorName={stand.vendor_name} onClose={() => setShowWA(false)} />}

      <div className="breadcrumb">
        <Link to="/">Market</Link> › <span>{stand.vendor_name}</span>
      </div>

      <div className="card" style={{ marginBottom: '28px' }}>
        <div style={{ background:'linear-gradient(135deg,var(--primary-light),#FDE68A)', padding:'32px 28px', display:'flex', alignItems:'center', gap:'20px', flexWrap:'wrap' }}>
          <div style={{ fontSize: '4rem', animation: 'float 3s ease-in-out infinite' }}>🏪</div>
          <div style={{ flex: 1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', flexWrap:'wrap', marginBottom:'6px' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 900 }}>{stand.vendor_name}</h1>
              {isOwner && <span className="owner-badge">Your Stand</span>}
            </div>
            <p style={{ color:'var(--text-muted)', marginBottom:'12px' }}>{stand.stand_description || 'Welcome to my ETOH stand!'}</p>
            <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
              <span className="stand-badge">📅 {new Date(stand.creation_date).toLocaleDateString()}</span>
              <span className="stand-badge">🛍️ {products.length} product{products.length !== 1 ? 's' : ''}</span>
            </div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:'8px', minWidth:'160px' }}>
            <button className="btn btn-red" onClick={() => setShowGate(true)}>📞 Contact Seller</button>
            <button className="whatsapp-btn" style={{ padding:'10px 16px', fontSize:'.88rem', animation:'waPulse 2.5s infinite' }} onClick={() => setShowWA(true)}>
              <span className="wa-logo">📱</span> WhatsApp
            </button>
            {isOwner && (
              <>
                <Link to={`/stands/${id}/add-product`} className="btn btn-primary btn-sm" style={{ textAlign:'center' }}>+ Add Product</Link>
                <Link to={`/stands/${id}/edit`} className="btn btn-outline btn-sm" style={{ textAlign:'center' }}>✏️ Edit Stand</Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="section-header">
        <span className="section-title">Products on this Stand</span>
        {isOwner && <Link to={`/stands/${id}/add-product`} className="btn btn-outline btn-sm">+ Add Product</Link>}
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <h3>No products yet</h3>
          {isOwner && <Link to={`/stands/${id}/add-product`} className="btn btn-primary" style={{ marginTop: '16px' }}>Add First Product</Link>}
        </div>
      ) : (
        <div className="grid grid-3">
          {products.map((p) => (
            <div key={p.id} style={{ position: 'relative' }}>
              <ProductCard product={{ ...p, vendor_name: stand.vendor_name }} />
              {isOwner && (
                <button className="product-delete-btn" onClick={() => handleDeleteProduct(p)} disabled={deletingId === p.id}>
                  {deletingId === p.id ? '…' : '🗑️'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
