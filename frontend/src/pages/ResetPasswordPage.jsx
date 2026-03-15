import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!token) {
      setError('Invalid reset link. Request a new one.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, newPassword });
      setMessage('Password updated. You can sign in now.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="glass" style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Invalid or missing reset link.</p>
          <Link to="/forgot-password" className="btn btn-primary" style={{ marginTop: '1rem' }}>Request new link</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', padding: '2rem 1rem' }}>
      <div className="glass animate-fade-in auth-card" style={{ padding: '2rem 1.5rem', borderRadius: 'var(--radius-lg)', maxWidth: '420px', width: '100%' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Set New Password</h1>
        {error && <div style={{ marginBottom: '1rem', padding: '0.5rem', background: 'rgba(220,38,38,0.1)', color: 'var(--danger)', borderRadius: 'var(--radius-sm)' }}>{error}</div>}
        {message && <div style={{ marginBottom: '1rem', padding: '0.5rem', background: 'rgba(34,197,94,0.15)', color: 'green', borderRadius: 'var(--radius-sm)' }}>{message}</div>}
        <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input type="password" placeholder="New password" className="input-field" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
          <input type="password" placeholder="Confirm new password" className="input-field" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Updating...' : 'Update Password'}</button>
        </form>
        <p style={{ marginTop: '1.5rem' }}><Link to="/login" style={{ color: 'var(--accent)' }}>Back to Sign In</Link></p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
