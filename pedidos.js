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

// Agrega esto al final de pedidos.js
function loadPedidos() {
  const pedidosContainer = document.getElementById('pedidos-container');
  pedidosContainer.innerHTML = '';
  
  let total = 0;
  let pending = 0;
  let completed = 0;
  
  // Recorrer todas las claves en localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('pedido_')) {
      const pedido = JSON.parse(localStorage.getItem(key));
      
      const pedidoCard = document.createElement('div');
      pedidoCard.className = `pedido-card ${pedido.estado}`;
      pedidoCard.innerHTML = `
        <div class="pedido-header">
          <h3>Pedido de ${pedido.nombre}</h3>
          <span class="fecha">${new Date(pedido.fecha).toLocaleString()}</span>
        </div>
        <div class="pedido-body">
          <p>Celular: <a href="tel:${pedido.celular}">${pedido.celular}</a></p>
          ${pedido.whatsappContact ? '<p>✅ Prefiere contacto por WhatsApp</p>' : ''}
          <div class="productos-list">
            <h4>Productos solicitados:</h4>
            <ul>
              ${pedido.productos.map(prod => 
                `<li><span class="codigo">${prod.codigo}</span> - ${prod.producto} (Cantidad: ${prod.cantidad})</li>`
              ).join('')}
            </ul>
          </div>
        </div>
        <div class="pedido-actions">
          <button class="action-btn complete-btn" data-id="${key}">Marcar como completado</button>
          <button class="action-btn delete-btn" data-id="${key}">Eliminar pedido</button>
        </div>
      `;
      
      pedidosContainer.appendChild(pedidoCard);
      
      total++;
      if (pedido.estado === 'pendiente') pending++;
      if (pedido.estado === 'completado') completed++;
    }
  }
  
  // Actualizar contadores
  document.getElementById('totalCount').textContent = total;
  document.getElementById('pendingCount').textContent = pending;
  document.getElementById('completedCount').textContent = completed;
  
  if (total === 0) {
    pedidosContainer.innerHTML = '<div class="no-pedidos">No hay pedidos registrados</div>';
  }
}

// Agregar eventos para los botones
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('complete-btn')) {
    const id = e.target.getAttribute('data-id');
    const pedido = JSON.parse(localStorage.getItem(id));
    pedido.estado = 'completado';
    localStorage.setItem(id, JSON.stringify(pedido));
    loadPedidos();
  }
  
  if (e.target.classList.contains('delete-btn')) {
    if (confirm('¿Estás seguro de eliminar este pedido?')) {
      const id = e.target.getAttribute('data-id');
      localStorage.removeItem(id);
      loadPedidos();
    }
  }
});

// Cargar pedidos al iniciar
loadPedidos();
