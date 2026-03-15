import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const BrandsPage = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/brands').then(({ data }) => setBrands(data || [])).catch(() => setBrands([])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Brands</h1>
      {loading ? <p>Loading...</p> : brands.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No brands yet.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {brands.map((brand) => (
            <Link key={brand._id} to={`/brands/${brand._id}`} className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-md)', textAlign: 'center', textDecoration: 'none', color: 'inherit' }}>
              {brand.logoUrl && <img src={brand.logoUrl} alt={brand.name} style={{ height: 60, objectFit: 'contain', marginBottom: '0.75rem' }} />}
              <h3 style={{ margin: 0 }}>{brand.name}</h3>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrandsPage;
