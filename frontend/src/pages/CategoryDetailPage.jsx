import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import { Star } from 'lucide-react';

const CategoryDetailPage = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories').then(({ data: cats }) => {
      const cat = (cats || []).find((c) => c._id === id);
      setCategory(cat || { name: 'Category' });
    }).catch(() => setCategory({ name: 'Category' }));
    api.get(`/products?category=${id}`).then(({ data }) => setProducts(data || [])).catch(() => setProducts([])).finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>{category?.name || 'Category'}</h1>
      {loading ? <p>Loading...</p> : products.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No products in this category.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
          {products.map((p) => (
            <Link key={p._id} to={`/product/${p._id}`} className="glass" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', textDecoration: 'none', color: 'inherit' }}>
              <img src={p.image} alt={p.name} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} />
              <div style={{ padding: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1rem' }}>{p.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}><Star size={14} fill="#f59e0b" /> {p.rating} ({p.numReviews})</div>
                <p style={{ margin: '0.25rem 0 0', fontWeight: 600 }}>${Number(p.price).toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
      <p style={{ marginTop: '2rem' }}><Link to="/categories">All Categories</Link></p>
    </div>
  );
};

export default CategoryDetailPage;
