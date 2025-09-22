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

    // --- Normalización del estado ---
    const allowed = ['Activo', 'Inactivo', 'En Actualización'];
    const incoming = (body.estado || '').normalize('NFC').trim();
    const match = allowed.find(a => a.toLowerCase() === incoming.toLowerCase());
    if (!match) {
      return res.status(422).json({
        error: 'Estado inválido. Use: Activo, Inactivo, En Actualización'
      });
    }
    body.estado = match; // Guardar con el formato canónico exacto

    const { data, error } = await supabase.from('cloud').insert([body]).select();
    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json(data[0]);
  }

  return res.status(405).json({ error: 'Método no permitido' });
};
