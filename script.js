document.addEventListener('DOMContentLoaded', function() {
  // Manejo del formulario de cotización
  const form = document.getElementById('cotizacion-form');
  if (form) {
    const mensaje = document.getElementById('mensaje');
    
    // Validación en tiempo real
    const nombreInput = document.getElementById('nombre');
    const celularInput = document.getElementById('celular');
    
    function validateNombre() {
      const nombreError = document.getElementById('nombre-error');
      if (nombreInput.value.trim().length < 3) {
        nombreError.textContent = 'El nombre debe tener al menos 3 caracteres';
        return false;
      } else {
        nombreError.textContent = '';
        return true;
      }
    }
    
    function validateCelular() {
      const celularError = document.getElementById('celular-error');
      const celular = celularInput.value.trim();
      
      if (!/^[0-9]{8}$/.test(celular)) {
        celularError.textContent = 'El celular debe tener 8 dígitos numéricos';
        return false;
      } else if (!/^(6|7)/.test(celular)) {
        celularError.textContent = 'El celular debe comenzar con 6 o 7';
        return false;
      } else {
        celularError.textContent = '';
        return true;
      }
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      
      if (!confirm('¿Estás seguro de enviar esta cotización?')) {
        return;
      }

      // Obtener productos de la tabla
      const productos = [];
      const filas = document.querySelectorAll('#productos-table tbody tr');
      
      filas.forEach(fila => {
        const codigo = fila.querySelector('.codigo').value;
        const producto = fila.querySelector('.producto').value;
        const cantidad = fila.querySelector('.cantidad').value;
        
        if (codigo && producto && cantidad) {
          productos.push({
            codigo,
            producto,
            cantidad: parseInt(cantidad)
          });
        }
      });

      if (productos.length === 0) {
        showMessage('Por favor, añade al menos un producto', 'error');
        return;
      }

      const nombre = nombreInput.value.trim();
      const celular = celularInput.value.trim();
      const whatsappContact = document.getElementById('whatsapp-contact').checked;

      const pedido = {
        nombre,
        celular,
        productos,
        whatsappContact,
        fecha: new Date().toISOString(),
        estado: 'pendiente'
      };

      // Guardar en localStorage
      const pedidoId = 'pedido_' + Date.now();
      localStorage.setItem(pedidoId, JSON.stringify(pedido));

      // Mostrar mensaje de éxito
      showMessage('¡Tu pedido ha sido enviado! Pronto nos contactaremos contigo.', 'success');
      
      // Enviar notificación por WhatsApp si está marcado
      if (whatsappContact) {
        sendWhatsAppNotification(pedido);
      }
      
      // Reiniciar formulario
      form.reset();
      document.querySelector('#productos-table tbody').innerHTML = '';
    });

    function showMessage(message, type) {
      mensaje.textContent = message;
      mensaje.className = `message ${type}`;
      mensaje.style.display = 'block';
      
      setTimeout(() => {
        mensaje.style.display = 'none';
      }, 5000);
    }

    function sendWhatsAppNotification(pedido) {
      const phone = '591' + pedido.celular;
      let message = `Nuevo pedido de ${pedido.nombre}:\n\n`;
      
      pedido.productos.forEach(prod => {
        message += `- ${prod.producto} (Código: ${prod.codigo}, Cantidad: ${prod.cantidad})\n`;
      });
      
      message += `\nTotal de productos: ${pedido.productos.length}`;
      
      const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      
      window.open(whatsappUrl, '_blank');
    }

    // Event listeners para validación en tiempo real
    nombreInput.addEventListener('input', validateNombre);
    celularInput.addEventListener('input', validateCelular);
  }

  // Manejo de productos
  const agregarProductoBtn = document.getElementById('agregar-producto');
  if (agregarProductoBtn) {
    agregarProductoBtn.addEventListener('click', function() {
      const tbody = document.querySelector('#productos-table tbody');
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><input type="text" class="codigo" placeholder="Ej: 001" required></td>
        <td><input type="text" class="producto" placeholder="Nombre del producto" required></td>
        <td><input type="number" class="cantidad" min="1" value="1" required></td>
        <td><button type="button" class="eliminar-producto">❌</button></td>
      `;
      tbody.appendChild(row);
    });
  }

  // Eliminar producto
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('eliminar-producto')) {
      e.target.closest('tr').remove();
    }
  });
});