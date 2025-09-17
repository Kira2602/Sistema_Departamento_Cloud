# Script de pruebas para el backend
Write-Host "=== Probando Backend API ===" -ForegroundColor Green

# Función para hacer requests
function Test-Endpoint {
    param($url, $method = "GET", $body = $null, $description)
    
    Write-Host "`n🔍 $description" -ForegroundColor Cyan
    Write-Host "   $method $url"
    
    try {
        $params = @{
            Uri = $url
            Method = $method
            ContentType = "application/json"
        }
        
        if ($body) {
            $params.Body = $body
        }
        
        $response = Invoke-RestMethod @params
        Write-Host "✅ SUCCESS:" -ForegroundColor Green
        $response | ConvertTo-Json -Depth 3
    }
    catch {
        Write-Host "❌ ERROR:" -ForegroundColor Red
        Write-Host $_.Exception.Message
        if ($_.Exception.Response) {
            Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
        }
    }
}

# Pruebas básicas
Test-Endpoint "http://localhost:3000" "GET" $null "Endpoint raíz"
Test-Endpoint "http://localhost:3000/health" "GET" $null "Health check"

# Pruebas de endpoints protegidos (deberían dar 401 sin token)
Test-Endpoint "http://localhost:3000/cloud" "GET" $null "Cloud resources (sin auth - debería fallar)"
Test-Endpoint "http://localhost:3000/profiles" "GET" $null "Profiles (sin auth - debería fallar)"

# Endpoint no existente (debería dar 404)
Test-Endpoint "http://localhost:3000/noexiste" "GET" $null "Endpoint inexistente (debería dar 404)"

Write-Host "`n=== Pruebas completadas ===" -ForegroundColor Green