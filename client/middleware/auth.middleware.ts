// Este sera el middleware que se encargara de verificar si el usuario esta autenticado

export default defineNuxtRouteMiddleware(async (to, from) => {
  const userString = localStorage.getItem("user");
  const actualUser = userString ? JSON.parse(userString) : null;

  // Si el usuario no esta autenticado, redirigir a la pagina de login
  if (!actualUser) {
    return navigateTo("/login");
  }

  // Si el usuario esta autenticado, continuar con la navegacion
  return true;
}
);