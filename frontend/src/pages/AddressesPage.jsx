import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const AddressesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ label: '', address: '', city: '', postalCode: '', country: '', isDefault: false });

  const load = () => api.get('/addresses').then(({ data }) => setAddresses(data || [])).catch(() => setAddresses([]));

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    load().finally(() => setLoading(false));
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/addresses/${editing._id}`, form);
        setEditing(null);
      } else {
        await api.post('/addresses', form);
      }
      setForm({ label: '', address: '', city: '', postalCode: '', country: '', isDefault: false });
      load();
    } catch (_) {}
  };

  const setDefault = async (id) => {
    try {
      await api.put(`/addresses/${id}`, { isDefault: true });
      load();
    } catch (_) {}
  };

  const deleteAddr = async (id) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      await api.delete(`/addresses/${id}`);
      load();
    } catch (_) {}
  };

  if (!user) return null;

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem', maxWidth: '700px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>My Addresses</h1>
      {loading ? <p>Loading...</p> : (
        <>
          <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>{editing ? 'Edit Address' : 'Add Address'}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input className="input-field" placeholder="Label (e.g. Home)" value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} />
              <input className="input-field" placeholder="Address" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} required />
              <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <input className="input-field" placeholder="City" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} required />
                <input className="input-field" placeholder="Postal Code" value={form.postalCode} onChange={(e) => setForm((f) => ({ ...f, postalCode: e.target.value }))} required />
              </div>
              <input className="input-field" placeholder="Country" value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} required />
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><input type="checkbox" checked={form.isDefault} onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))} /> Default address</label>
              <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Add'}</button>
              {editing && <button type="button" className="btn btn-outline" onClick={() => setEditing(null)}>Cancel</button>}
            </form>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {addresses.map((addr) => (
              <div key={addr._id} className="glass" style={{ padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  {addr.label && <strong>{addr.label}</strong>}
                  <p style={{ margin: '0.25rem 0 0' }}>{addr.address}, {addr.city} {addr.postalCode}, {addr.country}</p>
                  {addr.isDefault && <span style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>Default</span>}
                </div>
                <div className="address-card-actions" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button type="button" className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }} onClick={() => { setEditing(addr); setForm({ label: addr.label || '', address: addr.address, city: addr.city, postalCode: addr.postalCode, country: addr.country, isDefault: addr.isDefault }); }}>Edit</button>
                  {!addr.isDefault && <button type="button" className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }} onClick={() => setDefault(addr._id)}>Set default</button>}
                  <button type="button" className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem', color: 'var(--danger)' }} onClick={() => deleteAddr(addr._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <p style={{ marginTop: '2rem' }}><Link to="/profile">Back to Profile</Link></p>
    </div>
  );
};

export default AddressesPage;
