window.onload = function () {
    // Añadir parámetros a la URL
    const url = "http://localhost/TRISTAN/Login-v2/Api/api.php?tabla=libros";

    fetch(url)
        .then(function (respuesta) {
            if (!respuesta.ok) {
                throw new Error("Error en el fetch: " + respuesta.status);
            }
            return respuesta.json();
        })
        .then(function (datos) {
            console.log(datos);
        
        })
        .catch(function (error) {
            alert("Error accediendo a la url: " + error);
        });

}