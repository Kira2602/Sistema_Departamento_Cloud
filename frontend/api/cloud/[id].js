const { supabase } = require('../_lib/supabase');

const ESTADOS = ['Activo', 'Inactivo', 'En Actualización'];
const sanitize = (obj = {}) => {
  const o = { ...obj };
  if (typeof o.estado === 'string') o.estado = o.estado.trim();
  if (typeof o.codigo === 'string') o.codigo = o.codigo.trim();
  if (typeof o.proveedor === 'string') o.proveedor = o.proveedor.trim();
  if (typeof o.servicio === 'string') o.servicio = o.servicio.trim();
  if (typeof o.id_recurso === 'string') o.id_recurso = o.id_recurso.trim();
  if (typeof o.idRecurso === 'string') o.idRecurso = o.idRecurso.trim();
  return o;
};

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
    const body = sanitize(req.body || {});
    if (body.estado && !ESTADOS.includes(body.estado)) {
      return res.status(422).json({ error: `Estado inválido. Use: ${ESTADOS.join(', ')}` });
    }

    const { data, error } = await supabase
      .from('cloud')
      .update(body)
      .eq('id', id)
      .select();

    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json(data?.[0] || null);
  }

  if (req.method === 'DELETE') {
    const { error } = await supabase.from('cloud').delete().eq('id', id);
    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ success: true, id });
  }

  return res.status(405).json({ error: 'Método no permitido' });
};
