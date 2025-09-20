const { supabase } = require('../_lib/supabase');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('profiles').select('*');
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { data, error } = await supabase.from('profiles').insert([req.body]).select();
    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json(data[0]);
  }

  return res.status(405).json({ error: 'Método no permitido' });
};
