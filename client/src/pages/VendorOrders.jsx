import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders, updateOrderStatus } from '../api';

const STATUS_COLORS = { pending: '#f59e0b', confirmed: '#3b82f6', delivered: '#10b981', cancelled: '#ef4444' };

function StatusBadge({ status }) {
  const color = STATUS_COLORS[status] || '#64748b';
  return (
    <span style={{
      background: color + '20', color, border: `1px solid ${color}`,
      borderRadius: '999px', padding: '3px 10px', fontSize: '.75rem', fontWeight: 700, textTransform: 'capitalize'
    }}>
      {status}
    </span>
  );
}

export default function VendorOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    getMyOrders()
      .then(r => setOrders(r.data))
      .catch(e => alert(e.response?.data?.error || 'Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  async function handleStatusChange(id, status) {
    setUpdating(id);
    try {
      await updateOrderStatus(id, status);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update status');
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="page">
      <div className="breadcrumb">
        <Link to="/my-stands">My Stands</Link> › <span>My Orders</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="page-title">🛵 Delivery Requests</h1>
          <p className="page-subtitle">Manage orders placed for products on your stands.</p>
        </div>
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🛵</div>
          <h3>No orders yet</h3>
          <p>When buyers request delivery (Bendskin) for your products, they will appear here.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.9rem' }}>
            <thead>
              <tr>
                {['ID', 'Product', 'Buyer', 'Address', 'Order Date', 'Status', 'Update Status'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 800, color: 'var(--text-muted)', fontSize: '.8rem', textTransform: 'uppercase', letterSpacing: '.5px', borderBottom: '2px solid var(--border)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px' }}>#{o.id}</td>
                  <td style={{ padding: '16px', fontWeight: 600 }}>{o.product_name}</td>
                  <td style={{ padding: '16px' }}>{o.buyer_name}</td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: 600 }}>{o.target_city} / {o.target_quarter}</div>
                    <div style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>{o.near_landmark}</div>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{new Date(o.order_date).toLocaleDateString()}</td>
                  <td style={{ padding: '16px' }}><StatusBadge status={o.status || 'pending'} /></td>
                  <td style={{ padding: '16px' }}>
                    <select
                      className="form-select"
                      style={{ padding: '6px 10px', fontSize: '.8rem', height: 'auto', minWidth: '130px' }}
                      value={o.status || 'pending'}
                      disabled={updating === o.id}
                      onChange={e => handleStatusChange(o.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
