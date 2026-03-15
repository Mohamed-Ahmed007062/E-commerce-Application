import jwt from 'jsonwebtoken';
import supabase from '../config/supabase.js';

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { data: user, error } = await supabase
        .from('users')
        .select('id, name, email, is_admin')
        .eq('id', decoded.id)
        .single();
      if (error || !user) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
      }
      req.user = { _id: user.id, id: user.id, name: user.name, email: user.email, isAdmin: user.is_admin };
      return next();
    } catch (err) {
      console.error(err);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  return res.status(401).json({ message: 'Not authorized, no token' });
};

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

export { protect, admin };
