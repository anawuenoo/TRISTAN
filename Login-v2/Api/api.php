<?php
    // Activa la visualización de todos los errores
    error_reporting(E_ALL);
    ini_set("display_errors", 1);

    // Establece que el contenido devuelto será JSON
    header("Content-Type: application/json");

    // Conexión a la base de datos (archivo externo)
    require_once "conexion.php";
    
    // Detecta el método HTTP de la solicitud (GET, POST, PUT, DELETE)
    $metodo = $_SERVER["REQUEST_METHOD"];

    // Lee los datos JSON enviados por el cuerpo de la solicitud
    $entrada = json_decode(file_get_contents('php://input'), true);

    // Leer token de reCAPTCHA si está presente
    $recaptchaToken = $entrada["recaptchaToken"] ?? $_GET["recaptchaToken"] ?? null;

    // Verifica reCAPTCHA solo si se envió un token
    if ($recaptchaToken) {
        $verificacion = verificarRecaptcha($recaptchaToken);
        if (!$verificacion["success"]) {
            exit(json_encode(["error" => $verificacion["error"]]));
        }
        else {
            unset($entrada["recaptchaToken"]);
            unset($_GET["recaptchaToken"]);
        }
    }

    // Obtiene el nombre de la tabla desde los parámetros de la URL
    $tabla = $_GET['tabla'] ?? null;

    // Si no se especifica una tabla, se termina con un mensaje de error
    if (!$tabla) exit(json_encode(["error" => "Debe especificar una tabla"]));
    
    // Determina qué acción realizar según el método HTTP
    switch ($metodo) {
        case "GET":
            obtenerDatos($_conexion, $tabla, $_GET); // Leer datos
            break;
        case "POST":
            insertarDatos($_conexion, $tabla, $entrada); // Insertar nuevo registro
            break;
        case "PUT":
            actualizarDatos($_conexion, $tabla, $entrada, $_GET); // Actualizar registro
            break;
        case "DELETE":
            eliminarDatos($_conexion, $tabla, $_GET); // Eliminar registro
            break;
        default:
            echo json_encode(["error" => "Método no permitido"]);
    }
    
    // Función para obtener datos de una tabla con filtros opcionales
    function obtenerDatos($conexion, $tabla, $condiciones) {
        unset($condiciones["tabla"], $condiciones["recaptchaToken"], $condiciones["g-recaptcha-response"]); // Elimina el parámetro "tabla" del filtro y el recaptcha
        $sql = "SELECT * FROM $tabla";
        $valores = [];
        if (!empty($condiciones)) {
            // Construye cláusula WHERE con parámetros preparados
            $sql .= " WHERE " . implode(" AND ", array_map(fn($col) => "$col = ?", array_keys($condiciones)));
            $valores = array_values($condiciones);
        }
        $consulta = $conexion->prepare($sql);
        $consulta->execute($valores);
        echo json_encode($consulta->fetchAll()); // Devuelve resultados como JSON
    }

    // Función para insertar datos en una tabla
    function insertarDatos($conexion, $tabla, $datos) {
        unset($datos["recaptchaToken"], $datos["g-recaptcha-response"]);
        if (!$datos) exit(json_encode(["error" => "Datos inválidos"]));
    
        try {
            $sql = "INSERT INTO $tabla (" . implode(',', array_keys($datos)) . ") VALUES (" . str_repeat('?,', count($datos) - 1) . "?)";
            $consulta = $conexion->prepare($sql);
            $resultado = $consulta->execute(array_values($datos));
            echo json_encode(["mensaje" => "Registro insertado correctamente"]);
        } catch (PDOException $e) {
            if ($e->getCode() == 23000) {
                // Manejar error de clave duplicada
                preg_match("/Duplicate entry .* for key '(.*?)'/", $e->getMessage(), $matches);
                $campo = $matches[1] ?? 'campo_desconocido';
                $partes = explode('.', $campo);
                echo json_encode(["error" => "El valor ya existe para $partes[1]"]);
            } else {
                echo json_encode(["error" => $e->getMessage()]);
            }
        }
    }

    // Función para actualizar datos en una tabla
    function actualizarDatos($conexion, $tabla, $datos, $condiciones) {
        unset($condiciones["tabla"], $condiciones["recaptchaToken"], $condiciones["g-recaptcha-response"]);
        if (!$datos || !$condiciones) exit(json_encode(["error" => "Datos o condiciones inválidos"]));
        // Construye la sentencia SQL con parámetros preparados
        $sql = "UPDATE $tabla SET " . implode('=?, ', array_keys($datos)) . "=? WHERE " .
               implode(" AND ", array_map(fn($col) => "$col = ?", array_keys($condiciones)));
        $consulta = $conexion->prepare($sql);
        try {
            $resultado = $consulta->execute([...array_values($datos), ...array_values($condiciones)]);
            echo json_encode(["mensaje" => $resultado ? "Registro actualizado correctamente" : "Error al actualizar"]);
        } catch (\Throwable $th) {
            echo json_encode(["mensaje" => "Error al actualizar intenta de nuevo"]);
        }
    }

    // Función para eliminar datos de una tabla
    function eliminarDatos($conexion, $tabla, $condiciones) {
        unset($condiciones["tabla"], $condiciones["recaptchaToken"], $condiciones["g-recaptcha-response"]);
        if (!$condiciones) exit(json_encode(["error" => "Debe especificar condiciones para eliminar"]));
        $sql = "DELETE FROM $tabla WHERE " .
               implode(" AND ", array_map(fn($col) => "$col = ?", array_keys($condiciones)));
        $consulta = $conexion->prepare($sql);
        $resultado = $consulta->execute(array_values($condiciones));
        echo json_encode(["mensaje" => $resultado ? "Registro eliminado correctamente" : "Error al eliminar"]);
    }

    function verificarRecaptcha($token) {
        $secret = "Codigo ded seguridad";
        if (!$token) return ["success" => false, "error" => "Falta el token de reCAPTCHA"];
    
        $respuesta = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=$secret&response=$token");
        $resultado = json_decode($respuesta, true);
    
        return $resultado["success"]
            ? ["success" => true]
            : ["success" => false, "error" => "Verificación reCAPTCHA fallida"];
    }
?>
