// src/utils/fieldMapper.js

/**
 * Mapea los campos del frontend al formato del backend
 * @param {Object} frontendData - Datos del frontend
 * @returns {Object} - Datos formateados para el backend
 */
export function mapFrontendToBackend(frontendData) {
  // Helper function to parse cost - remove $ symbol and parse as float
  const parseCost = (costString) => {
    if (!costString) return 0;
    // Remove $ symbol and any whitespace, then parse
    const cleanCost = String(costString).replace(/[$\s]/g, '');
    const parsed = parseFloat(cleanCost);
    return isNaN(parsed) ? 0 : parsed;
  };

  return {
    codigo_recurso: frontendData.codigo,
    proveedor_cloud: frontendData.proveedor,
    servicio_producto: frontendData.servicio,
    id_recurso: frontendData.idRecurso, 
    region_zona: frontendData.region,
    estado: frontendData.estado,
    responsable: frontendData.responsable,
    costo_mensual_estimado: parseCost(frontendData.costo),
    fecha_inicio: frontendData.fechaInicio ? new Date(frontendData.fechaInicio).toISOString() : null,
    fecha_fin_contrato: frontendData.fechaFin ? new Date(frontendData.fechaFin).toISOString() : null,
    garantia: frontendData.garantia || '',
    notas: frontendData.notas || ''
  };
}

/**
 * Mapea los campos del backend al formato del frontend
 * @param {Object} backendData - Datos del backend
 * @returns {Object} - Datos formateados para el frontend
 */
export function mapBackendToFrontend(backendData) {
  return {
    id: backendData.id,
    codigo: backendData.codigo_recurso,
    proveedor: backendData.proveedor_cloud,
    servicio: backendData.servicio_producto,
    idRecurso: backendData.id_recurso,
    region: backendData.region_zona,
    estado: backendData.estado,
    responsable: backendData.responsable || 'No asignado',
    costo: formatCurrency(backendData.costo_mensual_estimado),
    costoNumerico: backendData.costo_mensual_estimado,
    fechaInicio: formatDate(backendData.fecha_inicio),
    fechaFin: formatDate(backendData.fecha_fin_contrato),
    garantia: backendData.garantia || '',
    notas: backendData.notas || '',
    created_at: backendData.created_at,
    updated_at: backendData.updated_at
  };
}

/**
 * Formatea una fecha del backend al formato del frontend
 * @param {string} dateString - Fecha en formato ISO
 * @returns {string} - Fecha formateada para mostrar
 */
function formatDate(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

/**
 * Formatea un número como moneda
 * @param {number} amount - Cantidad numérica
 * @returns {string} - Cantidad formateada como moneda
 */
function formatCurrency(amount) {
  if (!amount || isNaN(amount)) return '$0';
  
  return `$${parseFloat(amount).toFixed(2)}`;
}

/**
 * Valida los datos antes de enviar al backend
 * @param {Object} data - Datos a validar
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
export function validateResourceData(data) {
  const errors = [];
  
  if (!data.codigo_recurso?.trim()) {
    errors.push('Código de recurso es requerido');
  }
  
  if (!data.proveedor_cloud?.trim()) {
    errors.push('Proveedor cloud es requerido');
  }
  
  if (!data.servicio_producto?.trim()) {
    errors.push('Servicio/producto es requerido');
  }
  
  if (!data.id_recurso?.trim()) {
    errors.push('ID de recurso es requerido');
  }
  
  if (!data.estado?.trim()) {
    errors.push('Estado es requerido');
  }
  
  if (!data.responsable?.trim()) {
    errors.push('Responsable es requerido');
  }
  
  if (data.costo_mensual_estimado && isNaN(parseFloat(data.costo_mensual_estimado))) {
    errors.push('Costo mensual debe ser un número válido');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}