import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createStand } from '../api';

const CITIES = ['Douala', 'Yaoundé', 'Bamenda', 'Buea', 'Bafoussam', 'Kribi', 'Limbe', 'Ngaoundéré'];

export default function CreateStand() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ vendor_name: '', phone_number: '', stand_description: '', city: 'Douala' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function onChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!form.vendor_name.trim() || !form.phone_number.trim()) {
      setError('Stand name and phone number are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await createStand(form);
      navigate(`/stands/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create stand. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page" style={{ maxWidth: 600 }}>
      <div className="breadcrumb">
        <Link to="/">Market</Link> › <span>Open a Stand</span>
      </div>
      <h1 className="page-title">🏪 Open Your Virtual Stand</h1>
      <p className="page-subtitle">
        Set up your stand in the ETOH digital market — just like claiming your spot at Marché Mokolo!
      </p>

      <div className="card" style={{ padding: '28px' }}>
        {error && <div className="alert alert-error">⚠️ {error}</div>}

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label">Stand / Vendor Name *</label>
            <input
              className="form-input"
              name="vendor_name"
              value={form.vendor_name}
              onChange={onChange}
              placeholder="e.g. Mama Josephine's Fashion"
              required
            />
            <div className="form-hint">This is your market identity — make it memorable!</div>
          </div>

          <div className="form-group">
            <label className="form-label">Mobile Money Phone Number *</label>
            <input
              className="form-input"
              name="phone_number"
              value={form.phone_number}
              onChange={onChange}
              placeholder="e.g. 6 70 00 00 00"
              required
            />
            <div className="form-hint">Buyers will see this after accepting the safety guidelines.</div>
          </div>

          <div className="form-group">
            <label className="form-label">City *</label>
            <select className="form-select" name="city" value={form.city} onChange={onChange} required>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Stand Description</label>
            <textarea
              className="form-textarea"
              name="stand_description"
              value={form.stand_description}
              onChange={onChange}
              placeholder="Describe what you sell — 'Fresh vegetables, imported clothes, secondhand electronics...'"
            />
          </div>

          <div className="alert alert-info">
            💡 After creating your stand, you can add products with photos, videos, and voice notes.
          </div>

          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? 'Creating...' : '🚀 Launch My Stand'}
          </button>
        </form>
      </div>
    </div>
  );
}
