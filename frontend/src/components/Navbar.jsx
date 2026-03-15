import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, ChevronDown, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const closeAll = () => {
    setMenuOpen(false);
    setMobileOpen(false);
  };

  const navLinks = (
    <>
      <Link to="/" onClick={closeAll} style={{ color: 'var(--text-main)', fontSize: '1.05rem' }}>Home</Link>
      <Link to="/shop" onClick={closeAll} style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>Shop</Link>
      <Link to="/categories" onClick={closeAll} style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>Categories</Link>
      <Link to="/brands" onClick={closeAll} style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>Brands</Link>
    </>
  );

  return (
    <nav className={`glass nav-mobile ${mobileOpen ? 'open' : ''}`} style={{ position: 'sticky', top: 0, zIndex: 100, padding: '0.75rem 0', borderBottom: '1px solid var(--border)', backgroundColor: '#ffffff' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <Link to="/" onClick={closeAll} style={{ color: 'black' }}>
          <h2 style={{ margin: 0, fontSize: 'clamp(1.35rem, 4vw, 1.8rem)', fontWeight: 700, letterSpacing: '-0.5px' }}>StyleShop</h2>
        </Link>

        <div className="nav-center" style={{ display: 'flex', gap: '2.5rem', fontWeight: 500 }}>
          {navLinks}
        </div>

        <div className="nav-right-wrap" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/cart" onClick={closeAll} style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center' }} title="Cart">
            <ShoppingCart size={22} strokeWidth={1.5} />
          </Link>
          {user && (
            <Link to="/wishlist" onClick={closeAll} style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center' }} title="Wishlist">
              <Heart size={22} strokeWidth={1.5} />
            </Link>
          )}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button type="button" onClick={() => setMenuOpen(!menuOpen)} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'none', border: '1px solid var(--border)', padding: '0.5rem 0.75rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>
                <User size={18} />
                <span style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name?.split(' ')[0]}</span>
                <ChevronDown size={16} />
              </button>
              {menuOpen && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setMenuOpen(false)} aria-hidden="true" />
                  <div className="glass" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.35rem', minWidth: '180px', padding: '0.5rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', zIndex: 100 }}>
                    <Link to="/profile" style={{ display: 'block', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', textDecoration: 'none', color: 'inherit' }} onClick={() => { setMenuOpen(false); closeAll(); }}>Profile</Link>
                    <Link to="/orders" style={{ display: 'block', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', textDecoration: 'none', color: 'inherit' }} onClick={closeAll}>My Orders</Link>
                    <Link to="/addresses" style={{ display: 'block', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', textDecoration: 'none', color: 'inherit' }} onClick={closeAll}>Addresses</Link>
                    <button type="button" onClick={handleLogout} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.5rem 0.75rem', border: 'none', background: 'none', cursor: 'pointer', borderRadius: 'var(--radius-sm)', color: 'var(--danger)' }}>Logout</button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" onClick={closeAll} style={{ color: 'var(--text-main)', fontWeight: 500, fontSize: '1.05rem' }}>Login</Link>
              <Link to="/register" onClick={closeAll} style={{ backgroundColor: '#0a0a0a', color: 'white', padding: '0.6rem 1.25rem', borderRadius: '6px', fontWeight: 500, fontSize: '1rem' }}>Sign Up</Link>
            </>
          )}
        </div>

        <button type="button" className="nav-mobile-toggle" aria-label="Menu" onClick={() => setMobileOpen(!mobileOpen)} style={{ display: 'none', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'white', cursor: 'pointer' }}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      <div className="nav-mobile-menu" style={{ display: mobileOpen ? 'block' : 'none', background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '1rem', marginTop: '0.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {navLinks}
          <Link to="/cart" onClick={closeAll} style={{ padding: '0.75rem 0', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShoppingCart size={20} /> Cart</Link>
          {user && <Link to="/wishlist" onClick={closeAll} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Heart size={20} /> Wishlist</Link>}
          {user ? (
            <>
              <Link to="/profile" onClick={closeAll}>Profile</Link>
              <Link to="/orders" onClick={closeAll}>My Orders</Link>
              <Link to="/addresses" onClick={closeAll}>Addresses</Link>
              <button type="button" onClick={handleLogout} style={{ textAlign: 'left', padding: '0.5rem 0', color: 'var(--danger)', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 500 }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeAll} style={{ padding: '0.75rem 0', borderTop: '1px solid var(--border)' }}>Login</Link>
              <Link to="/register" onClick={closeAll} className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
