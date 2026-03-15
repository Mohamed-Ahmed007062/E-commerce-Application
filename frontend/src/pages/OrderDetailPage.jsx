import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const OrderDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    api.get(`/orders/${id}`).then(({ data }) => setOrder(data)).catch(() => setOrder(null)).finally(() => setLoading(false));
  }, [id, user, navigate]);

  if (!user) return null;
  if (loading) return <div className="container" style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>;
  if (!order) return <div className="container" style={{ padding: '3rem' }}><p>Order not found.</p><Link to="/orders">Back to Orders</Link></div>;

  const addr = order.shippingAddress || {};

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem', maxWidth: '800px' }}>
      <Link to="/orders" style={{ marginBottom: '1rem', display: 'inline-block', color: 'var(--accent)' }}>← Back to Orders</Link>
      <h1 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Order #{order._id?.slice(0, 8)}</h1>
      <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
        <h3 style={{ marginBottom: '0.75rem' }}>Shipping</h3>
        <p style={{ margin: 0 }}>{addr.address}, {addr.city} {addr.postalCode}, {addr.country}</p>
        <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>Payment: {order.paymentMethod} · {order.isPaid ? 'Paid' : 'Pending'} · {order.isDelivered ? 'Delivered' : 'Processing'}</p>
      </div>
      <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
        <h3 style={{ marginBottom: '1rem' }}>Items</h3>
        {(order.orderItems || []).map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
            <img src={item.image} alt={item.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
            <div style={{ flex: 1 }}><Link to={`/product/${item.product}`}>{item.name}</Link></div>
            <span>{item.qty} x ${Number(item.price).toFixed(2)}</span>
          </div>
        ))}
        <p style={{ marginTop: '1rem', fontWeight: 600 }}>Total: ${Number(order.totalPrice).toFixed(2)}</p>
      </div>
    </div>
  );
};

export default OrderDetailPage;
