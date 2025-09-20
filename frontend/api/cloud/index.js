const { supabase } = require('../_lib/supabase');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('cloud')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json(data || []);
    } catch (err) {
      return res.status(500).json({ error: 'Error interno', detail: err.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { data, error } = await supabase
        .from('cloud')
        .insert([req.body])
        .select();

      if (error) return res.status(400).json({ error: error.message });
      return res.status(201).json(data[0]);
    } catch (err) {
      return res.status(500).json({ error: 'Error interno', detail: err.message });
    }
  }

  return res.status(405).json({ error: 'Método no permitido' });
};
