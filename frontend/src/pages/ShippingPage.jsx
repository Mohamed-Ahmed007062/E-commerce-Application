import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const ShippingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [form, setForm] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
    paymentMethod: 'Card',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=shipping');
      return;
    }
    api.get('/cart')
      .then(({ data }) => {
        const items = (data.cartItems || []).map((item) => ({
          product: item.product?._id || item.product,
          name: item.product?.name,
          image: item.product?.image,
          price: item.product?.price ?? 0,
          qty: item.qty,
        }));
        setCartItems(items);
      })
      .catch(() => navigate('/cart'));
    api.get('/addresses').then(({ data }) => {
      setAddresses(data || []);
      const defaultAddr = (data || []).find((a) => a.isDefault) || (data || [])[0];
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr._id);
        setForm({ ...form, address: defaultAddr.address, city: defaultAddr.city, postalCode: defaultAddr.postalCode || defaultAddr.postal_code, country: defaultAddr.country, paymentMethod: 'Card' });
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const selectAddress = (addr) => {
    setSelectedAddressId(addr._id);
    setForm((prev) => ({ ...prev, address: addr.address, city: addr.city, postalCode: addr.postalCode || addr.postal_code, country: addr.country }));
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * Number(item.price), 0);

  const submitOrder = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.address.trim() || !form.city.trim() || !form.postalCode.trim() || !form.country.trim()) {
      setError('Please fill all shipping fields.');
      return;
    }
    if (cartItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    setSubmitting(true);
    try {
      const orderItems = cartItems.map((item) => ({
        product: item.product,
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
      }));
      const { data } = await api.post('/orders', {
        orderItems,
        shippingAddress: {
          address: form.address,
          city: form.city,
          postalCode: form.postalCode,
          country: form.country,
        },
        paymentMethod: form.paymentMethod,
        totalPrice,
      });
      navigate(`/order-confirm/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
      </div>
    );
  }

  if (cartItems.length === 0 && !loading) {
    return null;
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1.5rem', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Shipping & Checkout</h1>

      {error && (
        <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(220,38,38,0.1)', color: 'var(--danger)', borderRadius: 'var(--radius-sm)' }}>
          {error}
        </div>
      )}

      {addresses.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Saved Addresses</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {addresses.map((addr) => (
              <button type="button" key={addr._id} onClick={() => selectAddress(addr)} className="glass" style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', textAlign: 'left', border: selectedAddressId === addr._id ? '2px solid var(--accent)' : '1px solid var(--border)', cursor: 'pointer' }}>
                {addr.label && <strong>{addr.label} </strong>}{addr.address}, {addr.city} {addr.postalCode || addr.postal_code}, {addr.country} {addr.isDefault && '(Default)'}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={submitOrder} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Shipping Address</label>
          <input
            type="text"
            name="address"
            className="input-field"
            placeholder="Street address"
            value={form.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>City</label>
            <input type="text" name="city" className="input-field" value={form.city} onChange={handleChange} required />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Postal Code</label>
            <input type="text" name="postalCode" className="input-field" value={form.postalCode} onChange={handleChange} required />
          </div>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Country</label>
          <input type="text" name="country" className="input-field" value={form.country} onChange={handleChange} required />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Payment Method</label>
          <select name="paymentMethod" className="input-field" value={form.paymentMethod} onChange={handleChange}>
            <option value="Card">Card</option>
            <option value="PayPal">PayPal</option>
            <option value="Cash">Cash on Delivery</option>
          </select>
        </div>

        <div style={{ padding: '1rem', background: 'var(--surface)', borderRadius: 'var(--radius-md)', marginTop: '0.5rem' }}>
          <p style={{ margin: 0, fontSize: '1.1rem' }}>
            <strong>Total:</strong> ${totalPrice.toFixed(2)}
          </p>
          <p style={{ margin: '0.5rem 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {cartItems.length} item(s)
          </p>
        </div>

        <button type="submit" className="btn btn-primary" style={{ padding: '1rem', fontSize: '1.1rem' }} disabled={submitting}>
          {submitting ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
};

export default ShippingPage;
