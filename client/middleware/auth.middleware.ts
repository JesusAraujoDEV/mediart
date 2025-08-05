export default defineNuxtRouteMiddleware(async (to, from) => {
  const userString = localStorage.getItem("user");
  const actualUser = userString ? JSON.parse(userString) : null;

  if (!actualUser) {
    return navigateTo("/login");
  }

  return true;
});
