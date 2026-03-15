import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const OrdersPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    api.get('/orders/myorders').then(({ data }) => setOrders(data || [])).catch(() => setOrders([])).finally(() => setLoading(false));
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>My Orders</h1>
      {loading ? <p>Loading...</p> : orders.length === 0 ? (
        <div className="glass" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>You have no orders yet.</p>
          <Link to="/shop" className="btn btn-primary" style={{ marginTop: '1rem' }}>Start Shopping</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map((order) => (
            <Link key={order._id} to={`/orders/${order._id}`} className="glass" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', display: 'block', textDecoration: 'none', color: 'inherit' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontWeight: 600 }}>Order #{order._id?.slice(0, 8)}</span>
                <span>${Number(order.totalPrice).toFixed(2)}</span>
              </div>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {order.orderItems?.length || 0} item(s) · {order.isPaid ? 'Paid' : 'Pending'} · {order.isDelivered ? 'Delivered' : 'Processing'}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
