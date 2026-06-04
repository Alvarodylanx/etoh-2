import { useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { createProduct } from '../api';
import { CATEGORIES } from '../constants/categories';
import VoiceRecorder from '../components/VoiceRecorder';

export default function CreateProduct() {
  const { standId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ product_name: '', price_cfa: '', category: 'general' });
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const imageRef = useRef();
  const videoRef = useRef();

  function onChange(e) { setForm((f) => ({ ...f, [e.target.name]: e.target.value })); }

  async function onSubmit(e) {
    e.preventDefault();
    if (!form.product_name.trim() || !form.price_cfa) { setError('Product name and price are required.'); return; }
    setLoading(true); setError('');
    const fd = new FormData();
    fd.append('stand_id', standId);
    fd.append('product_name', form.product_name);
    fd.append('price_cfa', form.price_cfa);
    fd.append('category', form.category);
    if (imageFile) fd.append('image', imageFile);
    if (videoFile) fd.append('video', videoFile);
    if (audioBlob) fd.append('audio', audioBlob, 'voice-note.webm');
    try {
      await createProduct(fd);
      navigate(`/stands/${standId}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add product.');
    } finally { setLoading(false); }
  }

  return (
    <div className="page" style={{ maxWidth: 640 }}>
      <div className="breadcrumb">
        <Link to="/">Market</Link> ›
        <Link to={`/stands/${standId}`}>Stand #{standId}</Link> ›
        <span>Add Product</span>
      </div>
      <h1 className="page-title">📦 List a New Product</h1>
      <p className="page-subtitle">Add items to your stand with photos, videos, and a voice note.</p>

      {error && <div className="alert alert-error">⚠️ {error}</div>}

      <form onSubmit={onSubmit}>
        <div className="card" style={{ padding: '24px', marginBottom: '16px' }}>
          <div style={{ fontWeight: 800, marginBottom: '16px', color: 'var(--primary-dark)' }}>Basic Details</div>
          <div className="form-group">
            <label className="form-label">Product Name *</label>
            <input className="form-input" name="product_name" value={form.product_name} onChange={onChange} placeholder="e.g. Fresh Koki Beans (1 tin)" required />
          </div>
          <div className="form-group">
            <label className="form-label">Price (CFA Francs) *</label>
            <input className="form-input" type="number" name="price_cfa" value={form.price_cfa} onChange={onChange} placeholder="e.g. 5000" min="1" required />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" name="category" value={form.category} onChange={onChange}>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="card" style={{ padding: '24px', marginBottom: '16px' }}>
          <div style={{ fontWeight: 800, marginBottom: '16px', color: 'var(--primary-dark)' }}>📸 Product Photo</div>
          <div className="file-upload-area" onClick={() => imageRef.current.click()}>
            <input ref={imageRef} type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
            <div className="file-upload-icon">🖼️</div>
            <div className="file-upload-text">Click to upload a product photo (JPG, PNG)</div>
            {imageFile && <div className="file-preview-name">✅ {imageFile.name}</div>}
          </div>
        </div>

        <div className="card" style={{ padding: '24px', marginBottom: '16px' }}>
          <div style={{ fontWeight: 800, marginBottom: '16px', color: 'var(--primary-dark)' }}>🎬 Product Video (optional)</div>
          <div className="file-upload-area" onClick={() => videoRef.current.click()}>
            <input ref={videoRef} type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} />
            <div className="file-upload-icon">📹</div>
            <div className="file-upload-text">Click to upload a short video clip (MP4, max 50MB)</div>
            {videoFile && <div className="file-preview-name">✅ {videoFile.name}</div>}
          </div>
        </div>

        <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
          <div style={{ fontWeight: 800, marginBottom: '8px', color: 'var(--primary-dark)' }}>🎙️ Bayam-Sellam Voice Note</div>
          <p style={{ fontSize: '.85rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Record your pitch in Pidgin, French, or English — max 60 seconds.
          </p>
          <VoiceRecorder onRecorded={setAudioBlob} />
        </div>

        <button className="btn btn-primary btn-full" type="submit" disabled={loading} style={{ padding: '14px' }}>
          {loading ? 'Uploading...' : '✅ Publish Product'}
        </button>
      </form>
    </div>
  );
}
