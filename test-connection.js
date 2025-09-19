// Script de prueba para verificar la conexión entre frontend y backend
const http = require('http');

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsedData = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, data: parsedData, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: data, headers: res.headers });
        }
      });
    });
    
    req.on('error', reject);
    
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function testConnection() {
  console.log('🧪 Probando conexión con el backend...');
  
  try {
    // Test 1: Health check
    console.log('\n1️⃣ Probando health check...');
    const healthResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/health',
      method: 'GET'
    });
    console.log('✅ Health check exitoso:', healthResponse.data);
    
    // Test 2: Auth endpoint con datos inválidos
    console.log('\n2️⃣ Probando endpoint de auth con datos inválidos...');
    try {
      const authResponse = await makeRequest({
        hostname: 'localhost',
        port: 3000,
        path: '/auth/signin',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:5176'
        }
      }, JSON.stringify({
        email: 'test@test.com',
        password: 'wrongpassword'
      }));
      
      console.log('Status:', authResponse.status);
      console.log('Response:', authResponse.data);
      console.log('Headers CORS:', authResponse.headers['access-control-allow-origin']);
      
    } catch (error) {
      console.log('❌ Error en auth test:', error.message);
    }
    
    // Test 3: Registro de usuario
    console.log('\n3️⃣ Probando endpoint de registro...');
    const testEmail = `test.user.${Date.now()}@gmail.com`;
    try {
      const signupResponse = await makeRequest({
        hostname: 'localhost',
        port: 3000,
        path: '/auth/signup',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:5176'
        }
      }, JSON.stringify({
        email: testEmail,
        password: '123456789'
      }));
      
      console.log('Registro - Status:', signupResponse.status);
      console.log('Registro - Response:', signupResponse.data);
      
      if (signupResponse.status === 200) {
        console.log('\n4️⃣ Probando login con usuario recién creado...');
        const signinResponse = await makeRequest({
          hostname: 'localhost',
          port: 3000,
          path: '/auth/signin',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Origin': 'http://localhost:5176'
          }
        }, JSON.stringify({
          email: testEmail,
          password: '123456789'
        }));
        
        console.log('Login - Status:', signinResponse.status);
        console.log('Login - Response:', signinResponse.data);
      }
      
    } catch (signupError) {
      console.log('❌ Error en registro:', signupError.message);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

testConnection();