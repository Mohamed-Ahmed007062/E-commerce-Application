// Map Supabase row (id) to API shape expected by frontend (_id)
export const toId = (row) => {
  if (!row) return row;
  const { id, ...rest } = row;
  return { ...rest, _id: id, id };
};

export const toIdArray = (rows) => (Array.isArray(rows) ? rows.map(toId) : []);
