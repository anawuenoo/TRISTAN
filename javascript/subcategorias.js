window.onload = function () {

    boton.addEventListener("click", function (e) {
        e.preventDefault(); // Evita que el formulario recargue la página

            // Añadir parámetros a la URL
            const url = "http://localhost/TRISTAN/Login-v2/Api/api.php?tabla=usuarios&";

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
                        window.location.href = "../../index.html";
                    } else {
                        alert("Datos incorrectos");
                    }
                })
                .catch(function (error) {
                    alert("Error accediendo a la url: " + error);
                });
    });

}