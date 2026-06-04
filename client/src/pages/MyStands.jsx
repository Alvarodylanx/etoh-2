import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyStands, deleteStand } from '../api';
import { useAuth } from '../context/AuthContext';

export default function MyStands() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stands, setStands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    getMyStands()
      .then((res) => setStands(res.data))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(stand) {
    if (!window.confirm(`Delete "${stand.vendor_name}" and all its products? This cannot be undone.`)) return;
    setDeletingId(stand.id);
    try {
      await deleteStand(stand.id);
      setStands((prev) => prev.filter((s) => s.id !== stand.id));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete stand.');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="page">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="page-title">🏪 My Stands</h1>
          <p className="page-subtitle">Welcome back, <strong>{user?.name}</strong>. Manage your market stands here.</p>
        </div>
        <Link to="/create-stand" className="btn btn-primary">+ Open New Stand</Link>
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : stands.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏪</div>
          <h3>You have no stands yet</h3>
          <p>Open your first virtual market stand and start selling!</p>
          <Link to="/create-stand" className="btn btn-primary" style={{ marginTop: '16px' }}>
            Open My First Stand
          </Link>
        </div>
      ) : (
        <div className="grid grid-2">
          {stands.map((stand) => (
            <div key={stand.id} className="card" style={{ overflow: 'visible' }}>
              <div style={{ background: 'linear-gradient(135deg, var(--primary-light), #FDE68A)', padding: '20px 20px 16px', display: 'flex', gap: '14px', alignItems: 'center' }}>
                <div style={{ fontSize: '2.5rem' }}>🏪</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{stand.vendor_name}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {stand.stand_description || 'No description'}
                  </div>
                </div>
              </div>

              <div style={{ padding: '14px 20px' }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
                  <span className="stand-badge">📦 {stand.product_count ?? 0} products</span>
                  <span className="stand-badge">📅 {new Date(stand.creation_date).toLocaleDateString()}</span>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <Link to={`/stands/${stand.id}`} className="btn btn-outline btn-sm">View Stand</Link>
                  <Link to={`/stands/${stand.id}/add-product`} className="btn btn-primary btn-sm">+ Add Product</Link>
                  <Link to={`/stands/${stand.id}/edit`} className="btn btn-outline btn-sm">✏️ Edit</Link>
                  <button
                    className="btn btn-red btn-sm"
                    onClick={() => handleDelete(stand)}
                    disabled={deletingId === stand.id}
                  >
                    {deletingId === stand.id ? 'Deleting...' : '🗑️ Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
