## Aplicacion de tareas

Para correr la aplicación en cualquier ambiente primero debemos:

- Posicionarse en la ruta **prueba-practica**
- Tener docker desktop instalado 
- Ejecutar el comando **docker-compose up --build**
- Una vez que el contenedor levante ir a la ruta prueba-practica/backend **prueba-practica/backend**
- se requiere tener instalado **openjdk 17.0.6 2023-01-17** o superior
- Ejecutar el comando **./mvnw quarkus:dev**


## Funciones de la Aplicación
- Al Primer ingreso muestra **wizard-guide**
- Permite la **creación de usuario** 
- Permite el **inicio de sesión** de los usuarios
- Dentro de la sesión permite **crear tareas**
- Si hay tareas creadas permite hacer **drag and drop entre columnas** por estado
- Al dar click en una tarea permite **editarla o eliminarla** 
- **Perfil de usuario** al clikear en el nombre o en la foto
- Permite **cerrar sesión** desde el icono de logout en tareas o desde el botón cerrar sesión en el perfil