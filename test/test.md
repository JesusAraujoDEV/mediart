Caso de Prueba
Número de Prueba: Nº 1
Caso de Uso: Registrar Usuario
Estrategia: Prueba Unitaria
Descripción: Realización de una prueba unitaria al módulo de registro de usuario
Entradas: Nombre de usuario, Correo electrónico y Contraseña
Resultado Esperado: Registro satisfactorio del usuario
Resultado: El sistema permite el registro y redirige al usuario a la página de inicio
Observación: El registro falla si el correo ya está en uso, mostrando un mensaje de error adecuado

Caso de Prueba
Número de Prueba: Nº 2
Caso de Uso: Recuperar Contraseña
Estrategia: Prueba Unitaria
Descripción: Prueba unitaria del flujo de recuperación de contraseña
Entradas: Correo electrónico registrado
Resultado Esperado: Envío de correo de recuperación exitoso
Resultado: El sistema envía el correo correctamente y muestra mensaje de confirmación
Observación: Si el correo no está registrado, se muestra un mensaje de error sin revelar información sensible

Caso de Prueba
Número de Prueba: Nº 3
Caso de Uso: Editar Perfil
Estrategia: Prueba Unitaria
Descripción: Prueba unitaria para la edición de datos del perfil de usuario
Entradas: Nombre, descripción y foto de perfil
Resultado Esperado: Actualización exitosa de los datos del perfil
Resultado: El sistema guarda los cambios y actualiza la vista del perfil
Observación: Si la imagen es demasiado grande, se muestra un mensaje de error y no se actualiza

Caso de Prueba
Número de Prueba: Nº 4
Caso de Uso: Crear Playlist
Estrategia: Prueba Unitaria
Descripción: Prueba unitaria para la creación de una nueva playlist
Entradas: Nombre de la playlist y descripción
Resultado Esperado: Creación exitosa de la playlist
Resultado: El sistema añade la nueva playlist a la biblioteca del usuario
Observación: Si el nombre está vacío, el sistema muestra un mensaje de error y no crea la playlist

Caso de Prueba
Número de Prueba: Nº 5
Caso de Uso: Iniciar Sesión
Estrategia: Prueba Unitaria
Descripción: Realización de una prueba unitaria al módulo de Inicio de Sesión
Entradas: Nombre de usuario y Contraseña
Resultado Esperado: Un inicio de sesión satisfactorio
Resultado: Un error de autenticación, el cual al ingresar mal cualquier dato de entrada, el sistema seguía dirigiendo al usuario a la vista de Dashboard, vista que debe estar protegida
Observación: El error provenía de la falta de los metadatos necesario para cada vista, para determinar si el usuario tiene o no acceso a ingresar en el Dashboard o cualquier otra vista protegida
