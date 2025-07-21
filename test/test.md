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

Caso de Prueba
Número de Prueba: Nº 6
Caso de Uso: Buscar Elemento en Biblioteca
Estrategia: Prueba Unitaria
Descripción: Prueba unitaria del buscador de la biblioteca de usuario
Entradas: Término de búsqueda válido
Resultado Esperado: Se muestran los resultados relacionados con el término
Resultado: El sistema filtra y muestra correctamente los elementos
Observación: Si no hay coincidencias, se muestra un mensaje indicando que no se encontraron resultados

Caso de Prueba
Número de Prueba: Nº 7
Caso de Uso: Eliminar Playlist
Estrategia: Prueba Unitaria
Descripción: Prueba unitaria para la eliminación de una playlist existente
Entradas: Selección de una playlist y confirmación de eliminación
Resultado Esperado: La playlist es eliminada de la biblioteca del usuario
Resultado: El sistema elimina la playlist y actualiza la vista
Observación: Si la playlist contiene elementos, se solicita confirmación adicional antes de eliminar

Caso de Prueba
Número de Prueba: Nº 8
Caso de Uso: Seguir a un Usuario
Estrategia: Prueba Unitaria
Descripción: Prueba unitaria para la funcionalidad de seguir a otro usuario
Entradas: Selección del botón "Seguir" en el perfil de otro usuario
Resultado Esperado: El usuario es añadido a la lista de seguidos
Resultado: El sistema actualiza la lista de seguidos y muestra el cambio en la interfaz
Observación: Si ya se sigue al usuario, el botón cambia a "Dejar de seguir"

Caso de Prueba
Número de Prueba: Nº 9
Caso de Uso: Dejar de Seguir a un Usuario
Estrategia: Prueba Unitaria
Descripción: Prueba unitaria para dejar de seguir a un usuario
Entradas: Selección del botón "Dejar de seguir" en el perfil de un usuario seguido
Resultado Esperado: El usuario es eliminado de la lista de seguidos
Resultado: El sistema actualiza la lista y muestra el cambio en la interfaz
Observación: Si se intenta dejar de seguir a un usuario que no está en la lista, se muestra un mensaje de error

Caso de Prueba
Número de Prueba: Nº 10
Caso de Uso: Visualizar Perfil Público
Estrategia: Prueba Unitaria
Descripción: Prueba unitaria para la visualización del perfil público de otro usuario
Entradas: Acceso a la URL del perfil de otro usuario
Resultado Esperado: Se muestra la información pública del usuario
Resultado: El sistema carga correctamente los datos públicos del perfil
Observación: Si el usuario no existe, se muestra una página de error 404

Caso de Prueba
Número de Prueba: Nº 11
Caso de Uso: Cambiar Contraseña
Estrategia: Prueba Unitaria
Descripción: Prueba unitaria para el cambio de contraseña desde el perfil
Entradas: Contraseña actual, nueva contraseña y confirmación
Resultado Esperado: Cambio exitoso de la contraseña
Resultado: El sistema actualiza la contraseña y solicita iniciar sesión nuevamente
Observación: Si la contraseña actual es incorrecta, se muestra un mensaje de error

Caso de Prueba
Número de Prueba: Nº 12
Caso de Uso: Cerrar Sesión
Estrategia: Prueba Unitaria
Descripción: Prueba unitaria para la funcionalidad de cierre de sesión
Entradas: Selección de la opción "Cerrar sesión"
Resultado Esperado: El usuario es redirigido a la página de inicio o login
Resultado: El sistema elimina la sesión y redirige correctamente
Observación: Si ocurre un error, se muestra un mensaje y se mantiene la sesión activa

Caso de Prueba
Número de Prueba: Nº 13
Caso de Uso: Subir Imagen de Perfil
Estrategia: Prueba Unitaria
Descripción: Prueba unitaria para la subida de una nueva imagen de perfil
Entradas: Archivo de imagen válido
Resultado Esperado: La imagen se actualiza correctamente en el perfil
Resultado: El sistema guarda y muestra la nueva imagen
Observación: Si el archivo no es una imagen válida, se muestra un mensaje de error

Caso de Prueba
Número de Prueba: Nº 14
Caso de Uso: Reproducir Elemento Multimedia
Estrategia: Prueba Unitaria
Descripción: Prueba unitaria para la reproducción de un elemento multimedia desde la biblioteca
Entradas: Selección de un elemento multimedia
Resultado Esperado: El elemento se reproduce correctamente
Resultado: El sistema inicia la reproducción y muestra los controles
Observación: Si el archivo está dañado, se muestra un mensaje de error y no se reproduce

Caso de Prueba
Número de Prueba: Nº 15
Caso de Uso: Compartir Playlist
Estrategia: Prueba Unitaria
Descripción: Prueba unitaria para la funcionalidad de compartir una playlist
Entradas: Selección de la opción "Compartir" en una playlist
Resultado Esperado: Se genera un enlace para compartir la playlist
Resultado: El sistema muestra el enlace y permite copiarlo
Observación: Si la playlist es privada, se muestra un mensaje indicando que no se puede compartir
