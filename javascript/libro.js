window.onload=function(){
    const params = new URLSearchParams(window.location.search);
    const id = decodeURIComponent(params.get("id"));
    if (!id || id === "null") {
        window.location.href = "index.html";
    }
    else {
        const url = "http://localhost/TRISTAN/Login-v2/Api/api.php?tabla=libros&id="+id;
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

            })
            .catch(function (error) {
                alert("Error accediendo a la url: " + error);
            });
    }
    
}