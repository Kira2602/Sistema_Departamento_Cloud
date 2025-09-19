const http = require('http');

function createUser() {
  const postData = JSON.stringify({
    email: 'yudith.test@gmail.com',
    password: '123456789'
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/auth/signup',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Status de registro: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        console.log('Resultado del registro:', JSON.stringify(result, null, 2));
        
        if (res.statusCode === 200) {
          console.log('✅ Usuario creado exitosamente!');
          console.log('📧 Ahora puedes usar: yudith.test@gmail.com / 123456789');
        } else {
          console.log('⚠️ Error en el registro:', result.error);
        }
      } catch (e) {
        console.log('Response:', data);
      }
    });
  });

  req.on('error', (e) => {
    console.error('❌ Error:', e.message);
  });

  req.write(postData);
  req.end();
}

createUser();