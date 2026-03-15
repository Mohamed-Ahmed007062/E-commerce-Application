import bcrypt from 'bcryptjs';
import supabase from '../config/supabase.js';
import generateToken from '../utils/generateToken.js';
import { toId } from '../utils/formatRow.js';

const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data: user, error } = await supabase.from('users').select('*').eq('email', email).maybeSingle();
    if (error) throw error;
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.is_admin,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const { data: userExists } = await supabase.from('users').select('id').eq('email', email).maybeSingle();
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const { data: user, error } = await supabase
      .from('users')
      .insert({ name, email, password: hashed })
      .select()
      .single();
    if (error) throw error;
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.is_admin,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, is_admin')
      .eq('id', req.user.id)
      .single();
    if (error || !user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.is_admin,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Forgot password: create token and return it (in production, send via email)
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const { data: user } = await supabase.from('users').select('id').eq('email', email).maybeSingle();
    if (!user) {
      return res.json({ message: 'If that email exists, we sent a reset link.' });
    }
    const crypto = await import('crypto');
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour
    await supabase.from('password_reset_tokens').delete().eq('user_id', user.id);
    await supabase.from('password_reset_tokens').insert({ user_id: user.id, token, expires_at: expiresAt });
    res.json({ message: 'If that email exists, we sent a reset link.', resetToken: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Reset password with token (from email link)
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const { data: row } = await supabase.from('password_reset_tokens').select('user_id').eq('token', token).gte('expires_at', new Date().toISOString()).maybeSingle();
    if (!row) {
      return res.status(400).json({ message: 'Invalid or expired reset link.' });
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await supabase.from('users').update({ password: hashed, updated_at: new Date().toISOString() }).eq('id', row.user_id);
    await supabase.from('password_reset_tokens').delete().eq('token', token);
    res.json({ message: 'Password updated. You can sign in now.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Change password (logged-in user)
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { data: user } = await supabase.from('users').select('password').eq('id', req.user.id).single();
    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(401).json({ message: 'Current password is wrong.' });
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await supabase.from('users').update({ password: hashed, updated_at: new Date().toISOString() }).eq('id', req.user.id);
    res.json({ message: 'Password updated.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export { authUser, registerUser, getUserProfile, forgotPassword, resetPassword, changePassword };
