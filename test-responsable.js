const http = require('http');

function testCreateResource() {
  const postData = JSON.stringify({
    codigo_recurso: 'TEST-001',
    proveedor_cloud: 'AWS',
    servicio_producto: 'EC2',
    id_recurso: 'i-test123',
    estado: 'Activo',
    responsable: 'Yudith Noa',
    region_zona: 'us-east-1',
    costo_mensual_estimado: 50.00,
    garantia: 'N/A',
    notas: 'Recurso de prueba para verificar responsable'
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/cloud',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test' // Token de prueba (necesitarás uno real)
    }
  };

  console.log('🧪 Probando creación de recurso con responsable...');
  console.log('📝 Datos a enviar:', JSON.parse(postData));

  const req = http.request(options, (res) => {
    console.log(`📡 Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        console.log('✅ Respuesta del servidor:', JSON.stringify(result, null, 2));
        
        if (result.responsable) {
          console.log('🎯 ¡Responsable guardado correctamente!:', result.responsable);
        } else {
          console.log('❌ El responsable NO se guardó o llegó NULL');
        }
      } catch (e) {
        console.log('📄 Response raw:', data);
      }
    });
  });

  req.on('error', (e) => {
    console.error('❌ Error:', e.message);
  });

  req.write(postData);
  req.end();
}

// Primero verificar que el backend esté funcionando
const healthCheck = http.request({ hostname: 'localhost', port: 3000, path: '/health' }, (res) => {
  if (res.statusCode === 200) {
    console.log('✅ Backend funcionando correctamente');
    console.log('⚠️ NOTA: Necesitarás un token válido de autenticación para esta prueba');
    console.log('   Puedes obtenerlo haciendo login desde el frontend');
    // testCreateResource(); // Descomenta cuando tengas un token válido
  } else {
    console.log('❌ Backend no responde correctamente');
  }
});

healthCheck.on('error', (e) => {
  console.error('❌ No se puede conectar al backend:', e.message);
});

healthCheck.end();