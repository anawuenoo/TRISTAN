function abrirModal(rutaPDF) {
    document.getElementById('visorPDF').src = rutaPDF;
    document.getElementById('modal').style.display = 'block';
  }
  
  function cerrarModal() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('visorPDF').src = ''; // Limpia el visor
  }
  
  // Cerrar con ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === "Escape") cerrarModal();
  });