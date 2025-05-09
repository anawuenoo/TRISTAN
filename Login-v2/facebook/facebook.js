window.fbAsyncInit = function() {
    FB.init({
    appId      : '9652949088159347',
    cookie     : true,
    xfbml      : true,
    version    : 'v19.0' // Usa la última versión estable
    });

    FB.AppEvents.logPageView();   
};

function loginWithFacebook() {
    FB.login(function(response) {
      if (response.authResponse) {
        FB.api('/me', { fields: 'name,email' }, function(userInfo) {
          console.log('Usuario:', userInfo);
          // Aquí puedes enviar la info al servidor
        });
      } else {
        console.log('Inicio de sesión cancelado');
      }
    }, { scope: 'email,public_profile' });
  }