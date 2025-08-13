document.addEventListener('DOMContentLoaded', function() {
  // Verificación de sesión estricta
  if (!validateSession()) {
    sessionStorage.removeItem('adminSession');
    window.location.href = 'admin.html?error=invalid_session';
    return;
  }

  // Detectar navegación fuera de la página
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      sessionStorage.removeItem('adminSession');
    }
  });

  // Bloquear clic derecho y F12 (opcional)
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('keydown', e => {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
      e.preventDefault();
      sessionStorage.removeItem('adminSession');
      window.location.href = 'admin.html?error=security_breach';
    }
  });

  // Resto del código de gestión de pedidos...
  // [Mantén todas tus funciones existentes]

  function validateSession() {
    const token = sessionStorage.getItem('adminSession');
    if (!token) return false;
    
    try {
      // Verificar estructura básica del token
      return atob(token).split('|').length === 3;
    } catch {
      return false;
    }
  }
});