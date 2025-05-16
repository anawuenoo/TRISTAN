// Verificar si el usuario está logueado al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  checkLoginStatus();
});

function checkLoginStatus() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const authButtons = document.getElementById('auth-buttons');
  const userSection = document.getElementById('user-section');
  const userAvatar = document.getElementById('user-avatar');
  
  if (usuario) {
    // Ocultar botones de login/registro y mostrar sección de usuario
    authButtons.style.display = 'none';
    userSection.style.display = 'flex'; // Cambiado a flex para alinear bien
    
    // Mostrar la imagen del usuario si existe, sino la default
    if (usuario.foto_perfil) {
      userAvatar.src = usuario.foto_perfil;
    } else {
      userAvatar.src = 'img/usuarios.webp';
    }
  } else {
    // Mostrar botones de login/registro y ocultar sección de usuario
    authButtons.style.display = 'block';
    userSection.style.display = 'none';
  }
}

// Manejar el cierre de sesión
document.getElementById('logout-btn')?.addEventListener('click', function(e) {
  e.preventDefault();
  localStorage.removeItem('usuario');
  checkLoginStatus();
  window.location.href = 'index.html'; // Redirigir a la página principal
});