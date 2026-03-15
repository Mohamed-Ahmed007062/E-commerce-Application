import supabase from '../config/supabase.js';
import { toId, toIdArray } from '../utils/formatRow.js';

const getCategories = async (req, res) => {
  try {
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (error) throw error;
    res.json(toIdArray(data || []));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { data: existing } = await supabase.from('categories').select('id').eq('name', name).maybeSingle();
    if (existing) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    const { data, error } = await supabase.from('categories').insert({ name }).select().single();
    if (error) throw error;
    res.status(201).json(toId(data));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export { getCategories, createCategory };
