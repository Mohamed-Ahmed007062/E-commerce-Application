import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [resetToken, setResetToken] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage('');
    setResetToken('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setMessage(data.message || 'If that email exists, we sent a reset link.');
      if (data.resetToken) {
        setResetToken(data.resetToken);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', padding: '2rem 1rem' }}>
      <div className="glass animate-fade-in auth-card" style={{ padding: '2rem 1.5rem', borderRadius: 'var(--radius-lg)', maxWidth: '420px', width: '100%' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Forgot Password</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Enter your email and we'll send a reset link.</p>
        <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input type="email" placeholder="Email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Sending...' : 'Send Reset Link'}</button>
        </form>
        {message && <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{message}</p>}
        {resetToken && (
          <p style={{ marginTop: '0.75rem', fontSize: '0.85rem' }}>
            <strong>Dev reset link:</strong>{' '}
            <Link to={`/reset-password?token=${resetToken}`}>Click here to reset password</Link>
          </p>
        )}
        <p style={{ marginTop: '1.5rem' }}>
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Back to Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
