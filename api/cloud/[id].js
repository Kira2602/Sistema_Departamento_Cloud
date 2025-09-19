const { supabase } = require('../_lib/supabase');

module.exports = async (req, res) => {
  const { id } = req.query || {};
  if (!id) return res.status(400).json({ error: 'missing id param' });

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('cloud').select('*').eq('id', id).single();
      if (error) return res.status(404).json({ error: 'Recurso no encontrado' });
      return res.status(200).json(data);
    }

    if (req.method === 'PUT') {
      const { data, error } = await supabase.from('cloud').update(req.body).eq('id', id).select();
      if (error) return res.status(400).json({ error: error.message });
      if (!data?.length) return res.status(404).json({ error: 'Recurso no encontrado' });
      return res.status(200).json({ success: true, data: data[0], message: 'Recurso actualizado correctamente' });
    }

    if (req.method === 'DELETE') {
      const { data: exists, error: selErr } = await supabase.from('cloud').select('id').eq('id', id).single();
      if (selErr || !exists) return res.status(404).json({ error: 'Recurso no encontrado' });
      const { error: delErr } = await supabase.from('cloud').delete().eq('id', id);
      if (delErr) return res.status(400).json({ error: delErr.message });
      return res.status(200).json({ success: true, deleted: id, message: 'Recurso eliminado correctamente' });
    }

    res.status(405).json({ error: 'Método no permitido' });
  } catch (e) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
