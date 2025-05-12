window.onload = function () {
    const boton = document.querySelector('button[type="submit"]'); // Arreglado
    const form = document.querySelector('form');
    form.addEventListener('input', () => boton.disabled = !form.checkValidity());

    boton.addEventListener("click", function (e) {
        e.preventDefault(); // Evita que el formulario recargue la página
        let errores =[...document.getElementsByClassName("error")];
        if (form.checkValidity()&&!errores.some(e => !e.hidden)) {
            // Obtener datos del formulario
            const formData = new FormData(form);
            const formObject = Object.fromEntries(formData);

            // Convertir el objeto a una query string
            const params = new URLSearchParams(formObject).toString();

            // Añadir parámetros a la URL
            const url = "http://localhost/Login-v2/Api/api.php?tabla=usuarios&" + params;

            fetch(url)
                .then(function (respuesta) {
                    if (!respuesta.ok) {
                        throw new Error("Error en el fetch: " + respuesta.status);
                    }

                    const contentType = respuesta.headers.get('Content-Type');
                    if (contentType && contentType.includes('application/json')) {
                        return respuesta.json(); // Es un JSON
                    } else {
                        return respuesta.text(); // Es HTML o algo diferente
                    }
                })
                .then(function (datos) {
                    if (datos && Object.keys(datos).length > 0) {
                        localStorage.setItem("usuario", JSON.stringify(datos));
                        window.location.href = "inicio.html";
                    } else {
                        alert("Datos incorrectos");
                    }
                })
                .catch(function (error) {
                    alert("Error accediendo a la url: " + error);
                });
        }
    });

    //comprobar correo 
    let inputs=document.getElementsByTagName("input");
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    inputs[0].addEventListener("blur",  function(e){
        let correo_invalido=document.getElementById("email-invalido");
        if (!regex.test(form.correo.value)) {
            correo_invalido.hidden= false;
        }
        else {
            correo_invalido.hidden= true;
        }
    });

}