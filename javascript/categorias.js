window.onload = function () {
    // Añadir parámetros a la URL
    const url = "http://localhost/TRISTAN/Login-v2/Api/api.php?tabla=categorias";

    fetch(url)
        .then(function (respuesta) {
            if (!respuesta.ok) {
                throw new Error("Error en el fetch: " + respuesta.status);
            }
            return respuesta.json();
        })
        .then(function (datos) {
            console.log(datos);
            crearTarjetasCategorias(datos);
        })
        .catch(function (error) {
            alert("Error accediendo a la url: " + error);
        });

    function crearTarjetasCategorias(categorias) {
        const contenedor = document.getElementById('recomendados-carrusel');
        
        // Limpiar el contenedor (excepto la primera tarjeta que es tu template)
        const template = contenedor.querySelector('.cards__card');
        contenedor.innerHTML = '';
        contenedor.appendChild(template); // Mantenemos el template original
        
        // Recorrer cada categoría y crear una tarjeta (empezamos desde 1 porque ya tenemos el template)
        categorias.forEach(categoria => {
            // Clonar la tarjeta template
            const tarjeta = template.cloneNode(true);
            
            // Rellenar con los datos de la categoría
            const imagen = tarjeta.querySelector('.card__image');
            const titulo = tarjeta.querySelector('.card__title');
            
            imagen.src = categoria.imagen_categoria;
            imagen.alt = categoria.nombre;
            titulo.textContent = categoria.nombre;
            
            // Añadir la tarjeta al contenedor
            contenedor.appendChild(tarjeta);
        });
        
        // Opcional: eliminar el template original si no lo quieres
        template.remove();
    }
}