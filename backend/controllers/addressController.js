import supabase from '../config/supabase.js';
import { toId, toIdArray } from '../utils/formatRow.js';

const mapAddress = (row) => {
  if (!row) return row;
  const { id, user_id, postal_code, is_default, ...rest } = row;
  return { _id: id, id, userId: user_id, postalCode: postal_code, isDefault: is_default, ...rest };
};

const getAddresses = async (req, res) => {
  try {
    const { data, error } = await supabase.from('user_addresses').select('*').eq('user_id', req.user.id).order('is_default', { ascending: false });
    if (error) throw error;
    res.json(toIdArray(data || []).map(mapAddress));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const addAddress = async (req, res) => {
  try {
    const { label, address, city, postalCode, country, isDefault } = req.body;
    if (isDefault) {
      await supabase.from('user_addresses').update({ is_default: false }).eq('user_id', req.user.id);
    }
    const { data, error } = await supabase.from('user_addresses').insert({
      user_id: req.user.id,
      label: label || null,
      address,
      city,
      postal_code: postalCode,
      country,
      is_default: isDefault || false,
    }).select().single();
    if (error) throw error;
    res.status(201).json(mapAddress(data));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const updateAddress = async (req, res) => {
  try {
    const { label, address, city, postalCode, country, isDefault } = req.body;
    const updates = {};
    if (label !== undefined) updates.label = label;
    if (address !== undefined) updates.address = address;
    if (city !== undefined) updates.city = city;
    if (postalCode !== undefined) updates.postal_code = postalCode;
    if (country !== undefined) updates.country = country;
    if (isDefault !== undefined) {
      updates.is_default = isDefault;
      if (isDefault) {
        await supabase.from('user_addresses').update({ is_default: false }).eq('user_id', req.user.id);
      }
    }
    updates.updated_at = new Date().toISOString();
    const { data, error } = await supabase.from('user_addresses').update(updates).eq('id', req.params.id).eq('user_id', req.user.id).select().single();
    if (error) throw error;
    res.json(mapAddress(data));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { error } = await supabase.from('user_addresses').delete().eq('id', req.params.id).eq('user_id', req.user.id);
    if (error) throw error;
    res.json({ message: 'Address removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export { getAddresses, addAddress, updateAddress, deleteAddress };
