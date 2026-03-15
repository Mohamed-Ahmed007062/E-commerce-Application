import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const searchParams = new URLSearchParams(location.search);
  const qtyUrl = searchParams.get('qty');
  const productIdFromUrl = location.pathname.split('/')[2];

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartId, setCartId] = useState(null);

  // When logged in: fetch cart from API
  useEffect(() => {
    if (user) {
      api
        .get('/cart')
        .then(({ data }) => {
          setCartId(data._id);
          const items = (data.cartItems || []).map((item) => ({
            product: item.product?._id || item.product,
            name: item.product?.name,
            image: item.product?.image,
            price: item.product?.price ?? 0,
            countInStock: item.product?.countInStock ?? 99,
            qty: item.qty,
          }));
          setCartItems(items);
        })
        .catch(() => setCartItems([]))
        .finally(() => setLoading(false));
      return;
    }

    // Not logged in: if URL has product id (add to cart from product page), show that one item as local state
    if (productIdFromUrl) {
      api
        .get(`/products/${productIdFromUrl}`)
        .then(({ data }) => {
          setCartItems([
            {
              product: data._id,
              name: data.name,
              image: data.image,
              price: data.price,
              countInStock: data.countInStock ?? 99,
              qty: Number(qtyUrl) || 1,
            },
          ]);
        })
        .catch(() => setCartItems([]))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      setCartItems([]);
    }
  }, [user, productIdFromUrl, qtyUrl]);

  const removeFromCartHandler = async (id) => {
    if (user) {
      try {
        const { data } = await api.delete(`/cart/${id}`);
        setCartItems(
          (data.cartItems || []).map((item) => ({
            product: item.product?._id || item.product,
            name: item.product?.name,
            image: item.product?.image,
            price: item.product?.price ?? 0,
            countInStock: item.product?.countInStock ?? 99,
            qty: item.qty,
          }))
        );
      } catch (_) {}
      return;
    }
    setCartItems((prev) => prev.filter((item) => item.product !== id));
  };

  const updateQty = async (productId, newQty) => {
    if (user) {
      try {
        const { data } = await api.post('/cart', { productId, qty: newQty });
        setCartItems(
          (data.cartItems || []).map((item) => ({
            product: item.product?._id || item.product,
            name: item.product?.name,
            image: item.product?.image,
            price: item.product?.price ?? 0,
            countInStock: item.product?.countInStock ?? 99,
            qty: item.qty,
          }))
        );
      } catch (_) {}
      return;
    }
    setCartItems((prev) =>
      prev.map((x) => (x.product === productId ? { ...x, qty: newQty } : x))
    );
  };

  const checkoutHandler = () => {
    if (!user) {
      navigate('/login?redirect=shipping');
      return;
    }
    navigate('/shipping');
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1.5rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '3rem', borderBottom: '2px solid var(--primary)', paddingBottom: '1rem', display: 'inline-block' }}>Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 0', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-md)' }}>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Your cart is empty.</p>
          <Link to="/" className="btn btn-outline" style={{ marginTop: '2rem' }}>Go Back Shopping</Link>
        </div>
      ) : (
        <div className="cart-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '3rem', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {cartItems.map((item) => (
              <div key={item.product} className="glass cart-item-row" style={{ display: 'grid', gridTemplateColumns: '150px 1fr auto', gap: '2rem', padding: '1.5rem', borderRadius: 'var(--radius-md)', alignItems: 'center' }}>
                <Link to={`/product/${item.product}`}>
                  <img src={item.image} alt={item.name} style={{ width: '100%', borderRadius: 'var(--radius-sm)', objectFit: 'cover', height: '150px' }} />
                </Link>
                <div>
                  <Link to={`/product/${item.product}`} style={{ fontSize: '1.2rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>{item.name}</Link>
                  <p style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '1.1rem', marginBottom: '1rem' }}>${Number(item.price).toFixed(2)}</p>
                  <select
                    className="input-field"
                    value={item.qty}
                    onChange={(e) => updateQty(item.product, Number(e.target.value))}
                    style={{ width: '90px', padding: '0.5rem' }}
                  >
                    {[...Array(Math.max(1, item.countInStock || 99)).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>{x + 1}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => removeFromCartHandler(item.product)}
                  style={{ color: 'var(--danger)', fontSize: '1.5rem', padding: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}
                  title="Remove Item"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          <div className="glass cart-summary-card" style={{ padding: '2.5rem', borderRadius: 'var(--radius-md)', position: 'sticky', top: '120px', border: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>Order Summary</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-muted)' }}>
              <span>Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)}):</span>
              <span>${cartItems.reduce((acc, item) => acc + item.qty * Number(item.price), 0).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
              <span>Shipping:</span>
              <span>Calculated at checkout</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', fontSize: '1.5rem', fontWeight: 600 }}>
              <span>Total:</span>
              <span>${cartItems.reduce((acc, item) => acc + item.qty * Number(item.price), 0).toFixed(2)}</span>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '2.5rem', padding: '1.25rem' }} onClick={checkoutHandler}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
