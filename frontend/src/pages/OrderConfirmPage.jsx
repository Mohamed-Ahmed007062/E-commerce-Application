import React from 'react';
import { Link, useParams } from 'react-router-dom';

const OrderConfirmPage = () => {
  const { id } = useParams();

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1.5rem', textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
      <div className="glass" style={{ padding: '2.5rem', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Order Placed</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Thank you. Your order has been received.</p>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Order #{id?.slice(0, 8)}</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
          <Link to={`/orders/${id}`} className="btn btn-primary">View Order</Link>
          <Link to="/shop" className="btn btn-outline">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmPage;
