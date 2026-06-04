import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStands, getProducts } from '../api';
import { CATEGORIES, getCategoryMeta } from '../constants/categories';
import ProductCard from '../components/ProductCard';
const REGIONS = ['Douala', 'Yaoundé', 'Bamenda', 'Buea', 'Bafoussam', 'Kribi', 'Limbe', 'Ngaoundéré'];

export default function Home() {
  const [stands, setStands]           = useState([]);
  const [products, setProducts]       = useState([]);
  const [search, setSearch]           = useState('');
  const [tab, setTab]                 = useState('products');
  const [activeCategory, setCategory] = useState('all');
  const [activeRegion, setRegion]     = useState('all');
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    Promise.all([getStands(), getProducts()])
      .then(([s, p]) => { setStands(s.data); setProducts(p.data); })
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = p.product_name.toLowerCase().includes(q) || (p.vendor_name || '').toLowerCase().includes(q);
    const matchCat    = activeCategory === 'all' || p.category === activeCategory;
    const matchRegion = activeRegion === 'all'   || p.city === activeRegion;
    return matchSearch && matchCat && matchRegion;
  });

  const filteredStands = stands.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch = s.vendor_name.toLowerCase().includes(q) || (s.stand_description || '').toLowerCase().includes(q);
    const matchRegion = activeRegion === 'all' || s.city === activeRegion;
    return matchSearch && matchRegion;
  });

  return (
    <>
      {/* ── Hero ── */}
      <div className="hero">
        <div className="hero-badge">The Digital Central Market of Cameroon</div>
        <h1>Welcome to ETOH Market</h1>
        <p>Buy and sell fresh produce, fashion, electronics, cars, furniture and more from local Cameroonian vendors — safe, simple, affordable.</p>
        <div className="hero-actions">
          <Link to="/register" className="btn" style={{ background: 'white', color: 'var(--primary-dark)', fontWeight: 700 }}>
            🏪 Open My Stand
          </Link>
          <Link to="/market-buzz" className="btn" style={{ background: 'rgba(255,255,255,.18)', color: 'white', border: '2px solid rgba(255,255,255,.4)' }}>
            📢 Market Buzz
          </Link>
        </div>
        <div className="hero-cities">
          {REGIONS.slice(0, 5).map((c) => <span key={c} className="city-pill">📍 {c}</span>)}
        </div>
      </div>

      <div className="page">
        {/* Stats */}
        <div className="stats-strip">
          <div className="stat-item"><div className="stat-value">{stands.length}</div><div className="stat-label">Active Stands</div></div>
          <div className="stat-item"><div className="stat-value">{products.length}</div><div className="stat-label">Products Listed</div></div>
          <div className="stat-item"><div className="stat-value">12+</div><div className="stat-label">Reels</div></div>
          <div className="stat-item"><div className="stat-value">CFA</div><div className="stat-label">Local Currency</div></div>
        </div>

        {/* Tabs + Search */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '4px', borderBottom: '2px solid var(--border)' }}>
            <button className={`tab-btn ${tab === 'products' ? 'active' : ''}`} onClick={() => setTab('products')}>
              🛍️ Products ({filteredProducts.length})
            </button>
            <button className={`tab-btn ${tab === 'stands' ? 'active' : ''}`} onClick={() => setTab('stands')}>
              🏪 Stands ({filteredStands.length})
            </button>
          </div>
          <div className="search-bar">
            <span className="search-bar-icon">🔍</span>
            <input placeholder="Search products, vendors..." value={search} onChange={(e) => setSearch(e.target.value)} />
            {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1rem' }}>✕</button>}
          </div>
        </div>

        {/* Region filter */}
        <div style={{ marginBottom: '10px' }}>
          <div style={{ fontSize: '.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '.5px' }}>
            📍 Filter by Region
          </div>
          <div className="cat-bar">
            <button className={`cat-chip ${activeRegion === 'all' ? 'active' : ''}`} onClick={() => setRegion('all')}>
              🌍 All Cities
            </button>
            {REGIONS.map((r) => (
              <button key={r} className={`cat-chip ${activeRegion === r ? 'active' : ''}`} onClick={() => setRegion(r)}>
                📍 {r}
              </button>
            ))}
          </div>
        </div>

        {/* Category filter — products tab only */}
        {tab === 'products' && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '.5px' }}>
              🏷️ Category
            </div>
            <div className="cat-bar">
              <button className={`cat-chip ${activeCategory === 'all' ? 'active' : ''}`} onClick={() => setCategory('all')}>
                🛍️ All
              </button>
              {CATEGORIES.filter((c) => c.id !== 'general').map((c) => (
                <button key={c.id} className={`cat-chip ${activeCategory === c.id ? 'active' : ''}`} onClick={() => setCategory(c.id)}>
                  {c.icon} {c.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active filter summary */}
        {(activeRegion !== 'all' || activeCategory !== 'all') && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px', alignItems: 'center' }}>
            <span style={{ fontSize: '.82rem', color: 'var(--text-muted)' }}>Showing:</span>
            {activeRegion !== 'all' && (
              <span className="stand-badge" style={{ cursor: 'pointer' }} onClick={() => setRegion('all')}>
                📍 {activeRegion} ✕
              </span>
            )}
            {activeCategory !== 'all' && tab === 'products' && (
              <span className="stand-badge" style={{ cursor: 'pointer' }} onClick={() => setCategory('all')}>
                {getCategoryMeta(activeCategory).icon} {getCategoryMeta(activeCategory).label} ✕
              </span>
            )}
            <button
              onClick={() => { setRegion('all'); setCategory('all'); setSearch(''); }}
              style={{ fontSize: '.8rem', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
            >
              Clear all
            </button>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : tab === 'products' ? (
          filteredProducts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🛒</div>
              <h3>No products match your filters</h3>
              <p>Try a different region or category.</p>
              <button className="btn btn-outline" style={{ marginTop: '16px' }} onClick={() => { setRegion('all'); setCategory('all'); setSearch(''); }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-3">
              {filteredProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )
        ) : (
          filteredStands.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🏪</div>
              <h3>No stands in this area</h3>
              <p>Try a different city filter.</p>
            </div>
          ) : (
            <div className="grid grid-3">
              {filteredStands.map((s) => (
                <Link key={s.id} to={`/stands/${s.id}`} className="card stand-card">
                  <div className="stand-banner">🏪</div>
                  <div className="stand-info">
                    <div className="stand-name">{s.vendor_name}</div>
                    <div className="stand-desc">{s.stand_description || 'Welcome to my stand!'}</div>
                    <div className="stand-meta">
                      {s.city && <span className="stand-badge">📍 {s.city}</span>}
                      <span className="stand-badge">📅 {new Date(s.creation_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )
        )}

        {/* Market Buzz banner */}
        <div style={{ marginTop: '52px', background: 'linear-gradient(135deg,#111,#1a1a1a)', borderRadius: 'var(--radius)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px 32px', gap: 20, flexWrap: 'wrap' }}>
          <div>
            <div style={{ color: 'rgba(255,255,255,.5)', fontSize: '.8rem', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.5px' }}>Market Buzz</div>
            <div style={{ color: 'white', fontSize: '1.4rem', fontWeight: 900, marginBottom: 8 }}>🎬 Short Videos from Cameroon Vendors</div>
            <div style={{ color: 'rgba(255,255,255,.6)', fontSize: '.9rem' }}>Watch product demos, market tips, and vendor stories — scroll like TikTok.</div>
          </div>
          <Link to="/market-buzz" className="btn" style={{ background: 'white', color: '#111', fontWeight: 700, padding: '12px 24px', flexShrink: 0, animation: 'waPulse 2.5s infinite' }}>
            ▶ Watch Reels
          </Link>
        </div>
      </div>
    </>
  );
}
