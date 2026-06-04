import { Link } from 'react-router-dom';
import { getCategoryMeta } from '../constants/categories';

export default function ProductCard({ product }) {
  const cat = getCategoryMeta(product.category);

  function fmtPrice(n) {
    const num = Number(n);
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace('.0', '') + 'M CFA';
    return num.toLocaleString() + ' CFA';
  }

  return (
    <Link to={`/products/${product.id}`} className="card" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      {product.image_path ? (
        <img
          className="product-image"
          src={product.image_path}
          alt={product.product_name}
          onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex'; }}
        />
      ) : null}
      <div className="product-image-placeholder" style={{ display: product.image_path ? 'none' : 'flex' }}>
        {cat.icon}
      </div>

      <div className="card-body">
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '6px' }}>
          <span className="cat-badge">{cat.icon} {cat.label}</span>
          {product.city && (
            <span className="cat-badge" style={{ background: '#EFF6FF', color: '#1D4ED8' }}>
              📍 {product.city}
            </span>
          )}
        </div>

        <div className="card-title">{product.product_name}</div>
        <div className="card-subtitle">{product.vendor_name}</div>
        <div className="card-price">{fmtPrice(product.price_cfa)}</div>

        <div style={{ marginTop: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {product.audio_voice_path && (
            <span style={{ fontSize: '.72rem', background: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: '999px' }}>🎙️ Voice Note</span>
          )}
          {product.video_path && (
            <span style={{ fontSize: '.72rem', background: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: '999px' }}>🎬 Video</span>
          )}
        </div>
      </div>
    </Link>
  );
}
