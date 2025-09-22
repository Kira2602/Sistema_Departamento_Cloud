const { supabase } = require('../_lib/supabase');

const ESTADOS = ['Activo', 'Inactivo', 'En Actualización'];
const sanitize = (obj = {}) => {
  const o = { ...obj };
  if (typeof o.estado === 'string') o.estado = o.estado.trim();
  if (typeof o.codigo === 'string') o.codigo = o.codigo.trim();
  if (typeof o.proveedor === 'string') o.proveedor = o.proveedor.trim();
  if (typeof o.servicio === 'string') o.servicio = o.servicio.trim();
  if (typeof o.id_recurso === 'string') o.id_recurso = o.id_recurso.trim();
  if (typeof o.idRecurso === 'string') o.idRecurso = o.idRecurso.trim(); // por si llega con camelCase
  return o;
};

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
    if (!req.body) return res.status(400).json({ error: 'Faltan datos' });
    const body = sanitize(req.body);

    // Normaliza campo de estado
    if (body.estado && !ESTADOS.includes(body.estado)) {
      return res.status(422).json({ error: `Estado inválido. Use: ${ESTADOS.join(', ')}` });
    }

    const { data, error } = await supabase
      .from('cloud')
      .insert([body])
      .select();

    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json(data?.[0] || null);
  }

  return res.status(405).json({ error: 'Método no permitido' });
};
