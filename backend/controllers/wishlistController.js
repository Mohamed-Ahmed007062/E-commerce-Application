import supabase from '../config/supabase.js';

const getWishlist = async (req, res) => {
  try {
    const { data: rows, error } = await supabase
      .from('wishlists')
      .select('product_id, products(*, categories(name))')
      .eq('user_id', req.user.id);
    if (error) throw error;
    const items = (rows || []).map((r) => {
      const p = r.products || r.product;
      if (!p) return null;
      const cat = p.categories || p.category;
      return {
        _id: p.id,
        name: p.name,
        image: p.image,
        price: p.price,
        rating: p.rating,
        numReviews: p.num_reviews,
        countInStock: p.count_in_stock,
        category: cat ? { name: cat.name } : null,
      };
    }).filter(Boolean);
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const { error } = await supabase.from('wishlists').insert({ user_id: req.user.id, product_id: productId });
    if (error && error.code !== '23505') throw error; // 23505 = unique violation, already in wishlist
    res.status(201).json({ message: 'Added to wishlist' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    await supabase.from('wishlists').delete().eq('user_id', req.user.id).eq('product_id', req.params.productId);
    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export { getWishlist, addToWishlist, removeFromWishlist };
