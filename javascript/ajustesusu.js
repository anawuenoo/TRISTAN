// Verificar si el usuario está logueado al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  checkLoginStatus();
  if (window.location.pathname.split("/").pop()=="ajustes.html") {
    loadCurrentProfilePic();
  }
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
    if (usuario.fotoPerfil) {
      userAvatar.src = usuario.fotoPerfil;
    } else {
      userAvatar.src = 'img/usuarios.webp'; // Corregí la extensión (.webp)
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

/*******************
 * NUEVO CÓDIGO AÑADIDO *
 *******************/
function loadCurrentProfilePic() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const profilePic = document.getElementById('current-profile-pic');
  
  if (usuario && usuario.fotoPerfil) {
      profilePic.src = usuario.fotoPerfil;
  } else {
      profilePic.src = 'img/usuarios.webp'; // Imagen por defecto
  }
}

// Manejar la carga de nueva foto de perfil
document.getElementById('profile-pic-upload')?.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validar tamaño (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Máximo 2MB permitidos.');
        return;
    }
    
    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        alert('Formato no soportado. Solo JPG, PNG y WEBP.');
        return;
    }
    
    // Crear vista previa
    const reader = new FileReader();
    reader.onload = function(event) {
        const imgElement = document.getElementById('current-profile-pic');
        imgElement.src = event.target.result;
        
        // Actualizar en localStorage
        const usuario = JSON.parse(localStorage.getItem('usuario')) || {};
        usuario.fotoPerfil = event.target.result;
        localStorage.setItem('usuario', JSON.stringify(usuario));
        
        // Actualizar foto en el navbar
        const navAvatar = document.getElementById('user-avatar');
        if (navAvatar) navAvatar.src = event.target.result;
        
        // Mostrar mensaje de éxito
        alert('Foto de perfil actualizada correctamente');
    };
    reader.readAsDataURL(file);
});