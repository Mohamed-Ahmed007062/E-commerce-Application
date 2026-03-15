import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import { Star } from 'lucide-react';

const BrandDetailPage = () => {
  const { id } = useParams();
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/brands/${id}`).then(({ data }) => setBrand(data)).catch(() => setBrand(null)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container" style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>;
  if (!brand) return <div className="container" style={{ padding: '3rem' }}><p>Brand not found.</p><Link to="/brands">All Brands</Link></div>;

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {brand.logoUrl && <img src={brand.logoUrl} alt={brand.name} style={{ width: 80, height: 80, objectFit: 'contain' }} />}
        <div>
          <h1 style={{ margin: 0 }}>{brand.name}</h1>
          {brand.description && <p style={{ margin: '0.5rem 0 0', color: 'var(--text-muted)' }}>{brand.description}</p>}
        </div>
      </div>
      <h2 style={{ marginBottom: '1rem' }}>Products</h2>
      {(!brand.products || brand.products.length === 0) ? <p style={{ color: 'var(--text-muted)' }}>No products in this brand.</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
          {brand.products.map((p) => (
            <Link key={p._id} to={`/product/${p._id}`} className="glass" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', textDecoration: 'none', color: 'inherit' }}>
              <img src={p.image} alt={p.name} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} />
              <div style={{ padding: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1rem' }}>{p.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}><Star size={14} fill="#f59e0b" /> {p.rating}</div>
                <p style={{ margin: '0.25rem 0 0', fontWeight: 600 }}>${Number(p.price).toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrandDetailPage;
