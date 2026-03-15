import supabase from '../config/supabase.js';
import { toId } from '../utils/formatRow.js';

// Map cart row + items with product to frontend shape: { _id, user, cartItems: [{ product: { _id, name, price, image }, qty }] }
const mapCart = (cartRow, itemsWithProduct) => {
  if (!cartRow) return null;
  const cartItems = (itemsWithProduct || []).map((item) => {
    const prod = item.products || item.product;
    return {
      product: prod ? { _id: item.product_id, name: prod.name, price: prod.price, image: prod.image } : item.product_id,
      qty: item.qty,
    };
  });
  return {
    _id: cartRow.id,
    user: cartRow.user_id,
    cartItems,
  };
};

const getUserCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { data: cart, error: cartErr } = await supabase.from('carts').select('*').eq('user_id', userId).maybeSingle();
    if (cartErr) throw cartErr;
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    const { data: items, error: itemsErr } = await supabase
      .from('cart_items')
      .select('product_id, qty, products(name, price, image)')
      .eq('cart_id', cart.id);
    if (itemsErr) throw itemsErr;
    const itemsWithProduct = (items || []).map((i) => ({ ...i, products: i.products || i.product || null }));
    res.json(mapCart(cart, itemsWithProduct));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const addItemToCart = async (req, res) => {
  try {
    const { productId, qty } = req.body;
    const userId = req.user.id;
    let { data: cart } = await supabase.from('carts').select('*').eq('user_id', userId).maybeSingle();
    if (!cart) {
      const { data: newCart, error: insertErr } = await supabase.from('carts').insert({ user_id: userId }).select().single();
      if (insertErr) throw insertErr;
      cart = newCart;
    }
    const { data: existing } = await supabase.from('cart_items').select('id, qty').eq('cart_id', cart.id).eq('product_id', productId).maybeSingle();
    if (existing) {
      await supabase.from('cart_items').update({ qty }).eq('id', existing.id);
    } else {
      await supabase.from('cart_items').insert({ cart_id: cart.id, product_id: productId, qty: qty || 1 });
    }
    const { data: items } = await supabase.from('cart_items').select('product_id, qty, products(name, price, image)').eq('cart_id', cart.id);
    const itemsWithProduct = (items || []).map((i) => ({ ...i, products: i.products || i.product || null }));
    res.status(201).json(mapCart(cart, itemsWithProduct));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const removeItemFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;
    const { data: cart } = await supabase.from('carts').select('id').eq('user_id', userId).maybeSingle();
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    await supabase.from('cart_items').delete().eq('cart_id', cart.id).eq('product_id', productId);
    const { data: items } = await supabase.from('cart_items').select('product_id, qty, products(name, price, image)').eq('cart_id', cart.id);
    const itemsWithProduct = (items || []).map((i) => ({ ...i, products: i.products || i.product || null }));
    res.json(mapCart({ ...cart, user_id: userId }, itemsWithProduct));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export { getUserCart, addItemToCart, removeItemFromCart };
