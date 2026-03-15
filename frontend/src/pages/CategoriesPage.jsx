import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data || [])).catch(() => setCategories([])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Categories</h1>
      {loading ? <p>Loading...</p> : categories.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No categories yet.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {categories.map((cat) => (
            <Link key={cat._id} to={`/categories/${cat._id}`} className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-md)', textAlign: 'center', textDecoration: 'none', color: 'inherit', fontWeight: 600 }}>
              {cat.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
