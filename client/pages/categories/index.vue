<template>
  <NuxtLayout :name="'custom'">
  <div class="flex h-screen text-white font-bold" style="background-color:hsla(293,92%,31%,1);background-image:radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%),radial-gradient(at 80% 50%, hsla(340,100%,76%,1) 0px, transparent 50%),radial-gradient(at 80% 100%, hsla(242,100%,70%,1) 0px, transparent 50%);">
      <NavigationSidebar />
      <main class="w-full h-full overflow-y-auto">
        <div class="p-8 md:p-12 lg:p-16">
          <!-- Header section -->
          <header class="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h1 class="text-4xl md:text-5xl font-bold tracking-tighter">Descubre Mundos de Contenido</h1>
              <p class="text-neutral-400 mt-2 max-w-2xl">
                En Mediart, cada categoría es una puerta de entrada a universos culturales curados. Desde el dinamismo 
                del cine hasta la introspección de la literatura, te invitamos a explorar colecciones que inspiran, 
                emocionan y conectan. Sumérgete y encuentra tu próxima pasión.
              </p>
            </div>
          </header>

          <!-- Categories Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 md:gap-6">
            <NuxtLink v-for="category in categories" :key="category.name" :to="category.path" class="block group">
              <div class="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg">
                <img :src="category.image" :alt="category.name" class="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105" />
              </div>
              <p class="text-center text-sm mt-2 text-neutral-300 group-hover:text-white transition-colors duration-300">{{ category.name }}</p>
            </NuxtLink>
          </div>
        </div>
      </main>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { definePageMeta } from '#imports';
import NavigationSidebar from '~/components/navigation/Sidebar.vue';

definePageMeta({
  layout: "custom",
});

const categories = [
  { name: 'Mezcla', path: '/categories/mix', image: '/landingImages/mix.png' },
  { name: 'Canciones', path: '/categories/songs', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-W0mpYQjz6o5o3ZqX1xLvldzpctwOd4.png' },
  { name: 'Artistas', path: '/categories/artist', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-MgaTJsXIsgFtM80qTOcWgfRaN0pR9i.png' },
  { name: 'Álbumes', path: '/categories/albums', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-q8SwG2nu7aHg3SCfuiY0Nvuv30W7Pi.png' },
  { name: 'Películas', path: '/categories/movies', image: 'https://epigrambookshop.sg/cdn/shop/products/Crazy-Rich-Asians-Kevin-Kwan-Film-Tie-in-00_1200x1200_crop_center.jpg?v=1602758445' },
  { name: 'Series TV', path: '/categories/series', image: 'https://c-cdnet.cdn.smule.com/rs-s79/arr/5f/62/9f0d6130-0c6c-435c-97d4-42e0143a6583.jpg' },
  { name: 'Videojuegos', path: '/categories/videogames', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQALZbAQQwN-59cQ6SLhUs2EG8NaG7pY5-lQ&s' },
  { name: 'Libros', path: '/categories/books', image: 'https://cachedimages.podchaser.com/256x256/aHR0cHM6Ly9zdGF0aWMtMi5pdm9veC5jb20vY2FuYWxlcy85LzgvNC84LzEyNzE0NzAxMjg0ODlfWFhMLmpwZw%3D%3D/aHR0cHM6Ly93d3cucG9kY2hhc2VyLmNvbS9pbWFnZXMvbWlzc2luZy1pbWFnZS5wbmc%3D' },
];
</script>

<style scoped>
main {
  -webkit-overflow-scrolling: touch;
}
</style>
