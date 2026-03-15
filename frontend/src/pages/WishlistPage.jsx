import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Star, Heart } from 'lucide-react';

const WishlistPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    api.get('/wishlist').then(({ data }) => setItems(data || [])).catch(() => setItems([])).finally(() => setLoading(false));
  }, [user, navigate]);

  const remove = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`);
      setItems((prev) => prev.filter((p) => p._id !== productId));
    } catch (_) {}
  };

  if (!user) return null;

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Wishlist</h1>
      {loading ? <p>Loading...</p> : items.length === 0 ? (
        <div className="glass" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>Your wishlist is empty.</p>
          <Link to="/shop" className="btn btn-primary" style={{ marginTop: '1rem' }}>Browse Shop</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
          {items.map((product) => (
            <div key={product._id} className="glass" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <Link to={`/product/${product._id}`}>
                <img src={product.image} alt={product.name} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} />
              </Link>
              <div style={{ padding: '1rem' }}>
                <Link to={`/product/${product._id}`} style={{ fontWeight: 600, display: 'block', marginBottom: '0.25rem', textDecoration: 'none', color: 'inherit' }}>{product.name}</Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}><Star size={14} fill="#f59e0b" /> {product.rating} ({product.numReviews})</div>
                <p style={{ fontWeight: 600, color: 'var(--accent)' }}>${Number(product.price).toFixed(2)}</p>
                <button type="button" onClick={() => remove(product._id)} className="btn btn-outline" style={{ width: '100%', marginTop: '0.5rem' }}><Heart size={16} fill="currentColor" /> Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
