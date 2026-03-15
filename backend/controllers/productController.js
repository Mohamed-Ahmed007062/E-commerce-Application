import supabase from '../config/supabase.js';
import { toId, toIdArray } from '../utils/formatRow.js';

const mapProduct = (row) => {
  if (!row) return row;
  const { id, category_id, brand_id, count_in_stock, num_reviews, categories, category, brands, brand, ...rest } = row;
  const cat = categories || category;
  const br = brands || brand;
  const out = { ...rest, _id: id, id, category_id, brand_id: brand_id || null, countInStock: row.count_in_stock, numReviews: row.num_reviews };
  out.category = cat ? { name: cat.name } : { name: null };
  out.brand = br ? { _id: br.id, name: br.name } : null;
  return out;
};

const getProducts = async (req, res) => {
  try {
    let query = supabase.from('products').select('*, categories(name), brands(name)').order('created_at', { ascending: false });
    if (req.query.category) query = query.eq('category_id', req.query.category);
    if (req.query.brand) query = query.eq('brand_id', req.query.brand);
    const { data, error } = await query;
    if (error) throw error;
    res.json((data || []).map(mapProduct));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getProductById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name), brands(name)')
      .eq('id', req.params.id)
      .single();
    if (error || !data) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(mapProduct(data));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, price, description, image, category, countInStock, rating, numReviews } = req.body;
    const row = {
      name,
      image: image || '',
      description: description || '',
      category_id: category,
      price: Number(price) || 0,
      count_in_stock: Number(countInStock) ?? 0,
      rating: Number(rating) ?? 0,
      num_reviews: Number(numReviews) ?? 0,
    };
    const { data, error } = await supabase.from('products').insert(row).select().single();
    if (error) throw error;
    const { data: full } = await supabase.from('products').select('*, categories(name)').eq('id', data.id).single();
    res.status(201).json(mapProduct(full || data));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, price, description, image, category, countInStock, rating, numReviews } = req.body;
    const { data: existing, error: findErr } = await supabase.from('products').select('id').eq('id', req.params.id).single();
    if (findErr || !existing) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (price !== undefined) updates.price = Number(price);
    if (description !== undefined) updates.description = description;
    if (image !== undefined) updates.image = image;
    if (category !== undefined) updates.category_id = category;
    if (countInStock !== undefined) updates.count_in_stock = Number(countInStock);
    if (rating !== undefined) updates.rating = Number(rating);
    if (numReviews !== undefined) updates.num_reviews = Number(numReviews);
    updates.updated_at = new Date().toISOString();
    const { data, error } = await supabase.from('products').update(updates).eq('id', req.params.id).select().single();
    if (error) throw error;
    const { data: full } = await supabase.from('products').select('*, categories(name)').eq('id', data.id).single();
    res.json(mapProduct(full || data));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { error } = await supabase.from('products').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'Product removed' });
  } catch (error) {
    if (error.code === 'PGRST116') return res.status(404).json({ message: 'Product not found' });
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
