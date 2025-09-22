const { supabase } = require('../_lib/supabase');

module.exports = async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Falta parámetro id' });

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('cloud')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return res.status(404).json({ error: 'Recurso no encontrado' });
    return res.status(200).json(data);
  }

  if (req.method === 'PUT') {
    const update = { ...req.body };

    if (typeof update.estado !== 'undefined') {
      const allowed = ['Activo', 'Inactivo', 'En Actualización'];
      const incoming = String(update.estado || '').normalize('NFC').trim();
      const match = allowed.find(a => a.toLowerCase() === incoming.toLowerCase());
      if (!match) {
        return res.status(422).json({
          error: 'Estado inválido. Use: Activo, Inactivo, En Actualización'
        });
      }
      update.estado = match;
    }

    const { data, error } = await supabase
      .from('cloud')
      .update(update)
      .eq('id', id)
      .select();

    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json(data[0]);
  }

  if (req.method === 'DELETE') {
    const { error } = await supabase.from('cloud').delete().eq('id', id);
    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ success: true, id });
  }

  return res.status(405).json({ error: 'Método no permitido' });
};
