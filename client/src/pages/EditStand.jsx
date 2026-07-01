import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getStand, updateStand } from '../api';

const CITIES = ['Douala', 'Yaoundé', 'Bamenda', 'Buea', 'Bafoussam', 'Kribi', 'Limbe', 'Ngaoundéré'];

export default function EditStand() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ vendor_name: '', phone_number: '', stand_description: '', city: 'Douala' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getStand(id).then((res) => {
      const { stand } = res.data;
      setForm({ vendor_name: stand.vendor_name, phone_number: stand.phone_number, stand_description: stand.stand_description || '', city: stand.city || 'Douala' });
    }).catch(() => setError('Failed to load stand.')).finally(() => setLoading(false));
  }, [id]);

  function onChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await updateStand(id, form);
      navigate(`/stands/${id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update stand.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div className="page" style={{ maxWidth: 600 }}>
      <div className="breadcrumb">
        <Link to="/my-stands">My Stands</Link> › <span>Edit Stand</span>
      </div>
      <h1 className="page-title">✏️ Edit Your Stand</h1>
      {error && <div className="alert alert-error">⚠️ {error}</div>}
      <div className="card" style={{ padding: '28px' }}>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label">Stand / Vendor Name *</label>
            <input className="form-input" name="vendor_name" value={form.vendor_name} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Mobile Money Phone Number *</label>
            <input className="form-input" name="phone_number" value={form.phone_number} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">City *</label>
            <select className="form-select" name="city" value={form.city} onChange={onChange} required>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Stand Description</label>
            <textarea className="form-textarea" name="stand_description" value={form.stand_description} onChange={onChange} />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Saving...' : '✅ Save Changes'}
            </button>
            <Link to={`/stands/${id}`} className="btn btn-outline">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
