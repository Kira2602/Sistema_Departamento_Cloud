const { supabase } = require('../_lib/supabase');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('cloud')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json(data || []);
  }

  if (req.method === 'POST') {
    const body = req.body;
    if (!body) return res.status(400).json({ error: 'Faltan datos' });

    const { data, error } = await supabase.from('cloud').insert([body]).select();
    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json(data[0]);
  }

  return res.status(405).json({ error: 'Método no permitido' });
};
