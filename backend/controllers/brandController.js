import supabase from '../config/supabase.js';
import { toId, toIdArray } from '../utils/formatRow.js';

const mapBrand = (row) => {
  if (!row) return row;
  const { id, logo_url, ...rest } = row;
  return { ...rest, _id: id, id, logoUrl: logo_url || null };
};

const getBrands = async (req, res) => {
  try {
    const { data, error } = await supabase.from('brands').select('*').order('name');
    if (error) throw error;
    res.json(toIdArray(data || []).map(mapBrand));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getBrandById = async (req, res) => {
  try {
    const { data: brand, error } = await supabase.from('brands').select('*').eq('id', req.params.id).single();
    if (error || !brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    const { data: products } = await supabase.from('products').select('*, categories(name)').eq('brand_id', brand.id);
    const mapped = (products || []).map((p) => {
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
    });
    res.json({ ...mapBrand(brand), products: mapped });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const createBrand = async (req, res) => {
  try {
    const { name, logoUrl, description } = req.body;
    const { data, error } = await supabase.from('brands').insert({ name, logo_url: logoUrl, description }).select().single();
    if (error) throw error;
    res.status(201).json(mapBrand(data));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const updateBrand = async (req, res) => {
  try {
    const { name, logoUrl, description } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (logoUrl !== undefined) updates.logo_url = logoUrl;
    if (description !== undefined) updates.description = description;
    updates.updated_at = new Date().toISOString();
    const { data, error } = await supabase.from('brands').update(updates).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json(mapBrand(data));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const deleteBrand = async (req, res) => {
  try {
    const { error } = await supabase.from('brands').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'Brand removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export { getBrands, getBrandById, createBrand, updateBrand, deleteBrand };
