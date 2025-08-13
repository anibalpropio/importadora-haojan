document.addEventListener('DOMContentLoaded', function() {
  // Limpiar posible sesión residual
  sessionStorage.removeItem('adminSession');
  localStorage.removeItem('adminSession');

  const loginForm = document.getElementById('loginForm');
  
  if (loginForm) {
    // Bloquear múltiples intentos
    let attempts = 0;
    const maxAttempts = 3;
    
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (attempts >= maxAttempts) {
        showMessage('Demasiados intentos. Intente más tarde.', 'error');
        loginForm.querySelector('button').disabled = true;
        setTimeout(() => {
          loginForm.querySelector('button').disabled = false;
          attempts = 0;
        }, 30000); // 30 segundos de bloqueo
        return;
      }

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      
      // Validación más estricta
      if (username.trim() === 'admin' && password === '123moto') {
        // Token seguro con hash
        const sessionToken = generateSecureToken(username);
        sessionStorage.setItem('adminSession', sessionToken);
        
        // Registrar acceso
        const accessTime = new Date().toISOString();
        sessionStorage.setItem('lastAccess', accessTime);
        
        window.location.href = 'pedidos.html';
      } else {
        attempts++;
        showMessage(`Credenciales incorrectas. Intentos restantes: ${maxAttempts - attempts}`, 'error');
      }
    });
  }

  function generateSecureToken(user) {
    const time = Date.now();
    return btoa(`${user}|${time}|${Math.random().toString(36).substr(2)}`).slice(0, 32);
  }

  function showMessage(text, type) {
    const message = document.getElementById('login-message');
    message.textContent = text;
    message.className = `message ${type}`;
    message.style.display = 'block';
  }
});