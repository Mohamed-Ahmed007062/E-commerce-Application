import supabase from '../config/supabase.js';

const mapOrder = (orderRow, orderItemsRows, userRow) => {
  if (!orderRow) return null;
  const orderItems = (orderItemsRows || []).map((i) => ({
    name: i.name,
    qty: i.qty,
    image: i.image,
    price: Number(i.price),
    product: i.product_id,
  }));
  return {
    _id: orderRow.id,
    user: userRow ? { _id: userRow.id, name: userRow.name, email: userRow.email } : orderRow.user_id,
    orderItems,
    shippingAddress: orderRow.shipping_address,
    paymentMethod: orderRow.payment_method,
    totalPrice: Number(orderRow.total_price),
    isPaid: orderRow.is_paid,
    paidAt: orderRow.paid_at,
    isDelivered: orderRow.is_delivered,
    deliveredAt: orderRow.delivered_at,
    createdAt: orderRow.created_at,
    updatedAt: orderRow.updated_at,
  };
};

const addOrderItems = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        user_id: req.user.id,
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        total_price: totalPrice,
      })
      .select()
      .single();
    if (orderErr) throw orderErr;
    const rows = orderItems.map((item) => ({
      order_id: order.id,
      product_id: item.product,
      name: item.name,
      qty: item.qty,
      image: item.image,
      price: item.price,
    }));
    const { error: itemsErr } = await supabase.from('order_items').insert(rows);
    if (itemsErr) throw itemsErr;
    const { data: items } = await supabase.from('order_items').select('*').eq('order_id', order.id);
    res.status(201).json(mapOrder(order, items || [], null));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { data: order, error: orderErr } = await supabase.from('orders').select('*').eq('id', req.params.id).single();
    if (orderErr || !order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    const { data: user } = await supabase.from('users').select('id, name, email').eq('id', order.user_id).single();
    const { data: items } = await supabase.from('order_items').select('*').eq('order_id', order.id);
    res.json(mapOrder(order, items || [], user));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const updateOrderToPaid = async (req, res) => {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .update({ is_paid: true, paid_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();
    if (error || !order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    const { data: items } = await supabase.from('order_items').select('*').eq('order_id', order.id);
    res.json(mapOrder(order, items || [], null));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const updateOrderToDelivered = async (req, res) => {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .update({ is_delivered: true, delivered_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();
    if (error || !order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    const { data: items } = await supabase.from('order_items').select('*').eq('order_id', order.id);
    res.json(mapOrder(order, items || [], null));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const { data: orders, error } = await supabase.from('orders').select('*').eq('user_id', req.user.id).order('created_at', { ascending: false });
    if (error) throw error;
    const result = await Promise.all(
      (orders || []).map(async (order) => {
        const { data: items } = await supabase.from('order_items').select('*').eq('order_id', order.id);
        return mapOrder(order, items || [], null);
      })
    );
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getOrders = async (req, res) => {
  try {
    const { data: orders, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    const result = await Promise.all(
      (orders || []).map(async (order) => {
        const { data: user } = await supabase.from('users').select('id, name').eq('id', order.user_id).single();
        const { data: items } = await supabase.from('order_items').select('*').eq('order_id', order.id);
        return mapOrder(order, items || [], user);
      })
    );
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
};
