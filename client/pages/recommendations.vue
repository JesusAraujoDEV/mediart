<template>
  <NuxtLayout :name="'custom'">
    <div class="flex">
      <NavigationSidebar />

      <main class="min-h-screen w-full bg-white">
        <section class="container mx-auto px-6 py-10">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900">Recomendaciones del Equipo</h1>
              <p class="mt-3 max-w-3xl text-gray-600">
                Esta es una selección curada por el equipo de Mediart. No son resultados de la IA, sino nuestras
                recomendaciones personales por categoría para ayudarte a explorar lo mejor de cada mundo.
              </p>
            </div>
            <NuxtLink to="/categories" class="hidden md:inline-flex items-center gap-2 text-sm font-medium text-sky-700 hover:text-sky-800">
              Ver todas las categorías
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="inline"><path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </NuxtLink>
          </div>

          <!-- Movies Section -->
          <div class="mt-12">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Películas recomendadas</h2>
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <a
                v-for="movie in movies"
                :key="movie.id"
                :href="movie.url"
                target="_blank"
                rel="noopener noreferrer"
                class="group relative rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
                :aria-label="`Ver ${movie.title} en TMDb`"
              >
                <img
                  :src="movie.image"
                  :alt="movie.title"
                  loading="lazy"
                  class="h-64 w-full object-cover transition duration-300 group-hover:scale-[1.03] group-hover:brightness-90"
                />
                <div class="pointer-events-none absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <ArrowUpRight class="h-5 w-5 text-white drop-shadow" />
                </div>
                <div class="absolute inset-x-0 bottom-0">
                  <div class="h-28 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                </div>
                <div class="absolute inset-x-0 bottom-0 p-4 transform translate-y-16 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 class="text-white text-lg font-bold">{{ movie.title }}</h3>
                  <p class="mt-1 text-white/80 text-xs">{{ movie.year }}</p>
                  <p class="mt-2 text-white/90 text-sm opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
                    {{ movie.description }}
                  </p>
                </div>
              </a>
            </div>
          </div>

          <!-- Series Section -->
          <div class="mt-12">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Series recomendadas</h2>
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <a
                v-for="series in series"
                :key="series.id"
                :href="series.url"
                target="_blank"
                rel="noopener noreferrer"
                class="group relative rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
                :aria-label="`Ver ${series.title} en TMDb`"
              >
                <img
                  :src="series.image"
                  :alt="series.title"
                  loading="lazy"
                  class="h-64 w-full object-cover transition duration-300 group-hover:scale-[1.03] group-hover:brightness-90"
                />
                <div class="pointer-events-none absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <ArrowUpRight class="h-5 w-5 text-white drop-shadow" />
                </div>
                <div class="absolute inset-x-0 bottom-0">
                  <div class="h-28 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                </div>
                <div class="absolute inset-x-0 bottom-0 p-4 transform translate-y-16 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 class="text-white text-lg font-bold">{{ series.title }}</h3>
                  <p class="mt-1 text-white/80 text-xs">{{ series.year }}</p>
                  <p class="mt-2 text-white/90 text-sm opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
                    {{ series.description }}
                  </p>
                </div>
              </a>
            </div>
          </div>

          <!-- Songs Section -->
          <div class="mt-12">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Canciones recomendadas</h2>
            <div class="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
              <div
                v-for="song in songs"
                :key="song.id"
                class="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
              >
                <iframe
                  :src="song.embedUrl"
                  width="100%"
                  height="352"
                  frameBorder="0"
                  allowfullscreen=""
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  class="rounded-lg"
                  :title="`Reproducir ${song.title} de ${song.artist} en Spotify`"
                ></iframe>
              </div>
            </div>
          </div>

          <!-- Albums Section -->
          <div class="mt-12">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Álbumes recomendados</h2>
            <div class="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
              <div
                v-for="album in albums"
                :key="album.id"
                class="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
              >
                <iframe
                  :src="album.embedUrl"
                  width="100%"
                  height="352"
                  frameBorder="0"
                  allowfullscreen=""
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  class="rounded-lg"
                  :title="`Escuchar ${album.title} de ${album.artist} en Spotify`"
                ></iframe>
              </div>
            </div>
          </div>

          <!-- Artists Section -->
          <div class="mt-12">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Artistas recomendados</h2>
            <div class="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
              <div
                v-for="artist in artists"
                :key="artist.id"
                class="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
              >
                <iframe
                  :src="artist.embedUrl"
                  width="100%"
                  height="352"
                  frameBorder="0"
                  allowfullscreen=""
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  class="rounded-lg"
                  :title="`Escuchar ${artist.name} en Spotify`"
                ></iframe>
              </div>
            </div>
          </div>

          <!-- Video Games Section -->
          <div class="mt-12">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Videojuegos recomendados</h2>
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <a
                v-for="game in games"
                :key="game.id"
                :href="game.url"
                target="_blank"
                rel="noopener noreferrer"
                class="group relative rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
                :aria-label="`Ver ${game.title} en IGDB`"
              >
                <img
                  :src="game.image"
                  :alt="game.title"
                  loading="lazy"
                  class="h-64 w-full object-cover transition duration-300 group-hover:scale-[1.03] group-hover:brightness-90"
                />
                <div class="pointer-events-none absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <ArrowUpRight class="h-5 w-5 text-white drop-shadow" />
                </div>
                <div class="absolute inset-x-0 bottom-0">
                  <div class="h-28 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                </div>
                <div class="absolute inset-x-0 bottom-0 p-4 transform translate-y-16 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 class="text-white text-lg font-bold">{{ game.title }}</h3>
                  <p class="mt-1 text-white/80 text-xs">{{ game.year }}</p>
                  <p class="mt-2 text-white/90 text-sm opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
                    {{ game.description }}
                  </p>
                </div>
              </a>
            </div>
          </div>

          <!-- Books Section -->
          <div class="mt-12">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Libros recomendados</h2>
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <a
                v-for="book in books"
                :key="book.id"
                :href="book.url"
                target="_blank"
                rel="noopener noreferrer"
                class="group relative rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
                :aria-label="`Ver ${book.title} en Google Books`"
              >
                <img
                  :src="book.image"
                  :alt="book.title"
                  loading="lazy"
                  class="h-64 w-full object-cover transition duration-300 group-hover:scale-[1.03] group-hover:brightness-90"
                />
                <div class="pointer-events-none absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <ArrowUpRight class="h-5 w-5 text-white drop-shadow" />
                </div>
                <div class="absolute inset-x-0 bottom-0">
                  <div class="h-28 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                </div>
                <div class="absolute inset-x-0 bottom-0 p-4 transform translate-y-16 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 class="text-white text-lg font-bold">{{ book.title }}</h3>
                  <p class="mt-1 text-white/80 text-xs">{{ book.author }}</p>
                  <p class="mt-2 text-white/90 text-sm opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
                    {{ book.description }}
                  </p>
                </div>
              </a>
            </div>
          </div>

          

          <!-- Footnote -->
          <p class="mt-8 text-sm text-gray-500">
            Nota: Estas selecciones fueron creadas por el equipo de Mediart para inspirarte. Los enlaces te llevan a las plataformas oficiales para más información. Si quieres generar recomendaciones personalizadas con IA, visita la sección Studio.
          </p>
        </section>
      </main>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { definePageMeta } from '#imports';
import NavigationSidebar from '~/components/navigation/Sidebar.vue';
import { ArrowUpRight } from 'lucide-vue-next';

definePageMeta({
  layout: 'custom',
});

// Sample recommendations data with external links
const movies = [
  {
    id: 1,
    title: 'Spider-Man: Un nuevo universo',
    year: '2018',
    image: '/landingImages/Spiderverse.webp',
    url: 'https://www.themoviedb.org/movie/324857-spider-man-into-the-spider-verse?language=es-MX',
    description: 'Miles Morales se convierte en Spider-Man en un universo paralelo. Animación innovadora con múltiples Spider-Men.'
  },
  {
    id: 2,
    title: 'Volver al Futuro',
    year: '1985',
    image: 'https://image.tmdb.org/t/p/original/qskzmLTbarKnXDbo2HRj4NJ3vcW.jpg',
    url: 'https://www.themoviedb.org/movie/105-back-to-the-future?language=es-MX',
    description: 'Marty McFly viaja al pasado en un DeLorean modificado. Aventura temporal llena de humor y ciencia ficción.'
  },
  {
    id: 3,
    title: 'Son Como Niños 2',
    year: '2013',
    image: 'https://image.tmdb.org/t/p/original/u9NBaQ2cSJYE6RICDo7XaX3b2gw.jpg',
    url: 'https://www.themoviedb.org/movie/109418-grown-ups-2?language=es-MX',
    description: 'Los amigos de la infancia se reúnen para unas vacaciones caóticas. Comedia familiar con mucho humor.'
  },
  {
    id: 4,
    title: 'Locamente millonarios',
    year: '2018',
    image: 'https://image.tmdb.org/t/p/original/zeHB7aP46Xs3u4aFLuAq2GFeUGb.jpg',
    url: 'https://www.themoviedb.org/movie/455207-crazy-rich-asians?language=es-MX',
    description: 'Una mujer descubre el mundo opulento de la familia de su novio en Singapur. Romance multicultural y drama familiar.'
  }
];

const series = [
  {
    id: 1,
    title: 'Breaking Bad',
    year: '2008-2013',
    image: 'https://image.tmdb.org/t/p/original/nt2GqQjY4LP4whticSC405u2tSV.jpg',
    url: 'https://www.themoviedb.org/tv/1396-breaking-bad',
    description: 'Walter White, profesor de química, se convierte en fabricante de metanfetaminas tras ser diagnosticado con cáncer terminal.'
  },
  {
    id: 2,
    title: 'The Office (US)',
    year: '2005-2013',
    image: 'https://image.tmdb.org/t/p/original/bX6Sypdpk0r8YFdVPoc3yeyvSmm.jpg',
    url: 'https://www.themoviedb.org/tv/2316-the-office',
    description: 'Serie mockumentary que sigue la vida cotidiana de los empleados de la oficina Dunder Mifflin en Scranton, Pennsylvania.'
  },
  {
    id: 3,
    title: 'One Piece',
    year: '1999-Presente',
    image: 'https://image.tmdb.org/t/p/original/fFI7CYmqbW28eD7QbSxtUk9dABO.jpg',
    url: 'https://www.themoviedb.org/tv/37854?language=es-MX',
    description: 'Monkey D. Luffy y su tripulación pirata buscan el tesoro legendario One Piece para convertirse en el Rey de los Piratas.'
  },
  {
    id: 4,
    title: 'The Mandalorian',
    year: '2019-Presente',
    image: 'https://image.tmdb.org/t/p/original/59eDHKhCrhLyHCXPboILF441w4O.jpg',
    url: 'https://www.themoviedb.org/tv/82856-the-mandalorian',
    description: 'Un cazarrecompensas solitario navega por las peligrosas fronteras exteriores de la galaxia, lejos de la autoridad de la Nueva República.'
  }
];

const songs = [
  {
    id: 1,
    title: 'Flamingo',
    artist: 'La Vida Bohème',
    embedUrl: 'https://open.spotify.com/embed/track/76a1BkZRJszgAFmacNJYIH?utm_source=generator'
  },
  {
    id: 2,
    title: 'Now That We Don\'t Talk (Taylor\'s Version) (From The Vault)',
    artist: 'Taylor Swift',
    embedUrl: 'https://open.spotify.com/embed/track/5KD6AEm19QnMbfWpfoOHMl?utm_source=generator'
  },
  {
    id: 3,
    title: 'Stay With Me',
    artist: 'Miki Matsubara',
    embedUrl: 'https://open.spotify.com/embed/track/2BHj31ufdEqVK5CkYDp9mA?utm_source=generator'
  },
  {
    id: 4,
    title: 'Otro Atardecer',
    artist: 'Bad Bunny',
    embedUrl: 'https://open.spotify.com/embed/track/0E0DRHf5PfMeor0ZCwB3oT?utm_source=generator'
  }
];

const albums = [
  {
    id: 1,
    title: 'Abbey Road',
    artist: 'The Beatles',
    embedUrl: 'https://open.spotify.com/embed/album/0ETFjACtuP2ADo6LFhL6HN?utm_source=generator'
  },
  {
    id: 2,
    title: 'Muerte',
    artist: 'Canserbero',
    embedUrl: 'https://open.spotify.com/embed/album/27xqCLyTHom0wyjtw08K12?utm_source=generator'
  },
  {
    id: 3,
    title: 'Back in Black',
    artist: 'AC/DC',
    embedUrl: 'https://open.spotify.com/embed/album/6mUdeDZCsExyJLMdAfDuwh?utm_source=generator'
  },
  {
    id: 4,
    title: 'Random Access Memories',
    artist: 'Daft Punk',
    embedUrl: 'https://open.spotify.com/embed/album/4m2880jivSbbyEGAKfITCa?utm_source=generator'
  }
];

const artists = [
  {
    id: 1,
    name: 'Radiohead',
    embedUrl: 'https://open.spotify.com/embed/artist/4Z8W4fKeB5YxbusRsdQVPb?utm_source=generator'
  },
  {
    id: 2,
    name: 'Taylor Swift',
    embedUrl: 'https://open.spotify.com/embed/artist/06HL4z0CvFAxyc27GXpf02?utm_source=generator'
  },
  {
    id: 3,
    name: 'Latin Mafia',
    embedUrl: 'https://open.spotify.com/embed/artist/6XTGKOV9jceQ6f67lnhpbF?utm_source=generator'
  },
  {
    id: 4,
    name: 'The Strokes',
    embedUrl: 'https://open.spotify.com/embed/artist/0epOFNiUfyON9EYx7Tpr6V?utm_source=generator'
  }
];

const games = [
  {
    id: 1,
    title: 'Minecraft',
    year: '2009',
    image: 'https://images.igdb.com/igdb/image/upload/t_720p/sc8d2p.webp',
    url: 'https://www.igdb.com/games/minecraft--1',
    description: 'Mundo de bloques infinito donde puedes construir, explorar y sobrevivir. La creatividad no tiene límites en este sandbox revolucionario.'
  },
  {
    id: 2,
    title: 'Rocket League',
    year: '2015',
    image: 'https://images.igdb.com/igdb/image/upload/t_720p/w23nbjchdt6ulfxws9nt.webp',
    url: 'https://www.igdb.com/games/rocket-league',
    description: 'Fusión perfecta entre fútbol y coches. Conduce vehículos con ruedas para marcar goles en partidos trepidantes.'
  },
  {
    id: 3,
    title: 'Lego Batman 2: DC Super Heroes',
    year: '2012',
    image: 'https://images.igdb.com/igdb/image/upload/t_720p/h2p5rdfvadwa8agu5rld.webp',
    url: 'https://www.igdb.com/games/lego-batman-2-dc-super-heroes',
    description: 'Batman y Robin unen fuerzas con la Liga de la Justicia para salvar Gotham. Aventura familiar llena de humor y acción.'
  },
  {
    id: 4,
    title: 'Persona 5',
    year: '2016',
    image: 'https://images.igdb.com/igdb/image/upload/t_720p/hv41uaug9qpyhf0ecf9a.webp',
    url: 'https://www.igdb.com/games/persona-5',
    description: 'Estudiantes de secundaria se convierten en ladrones fantasma para combatir la corrupción. Mezcla de RPG, simulación social y combate por turnos.'
  }
];

const books = [
  {
    id: 1,
    title: '1984',
    author: 'George Orwell',
    image: 'https://books.google.co.ve/books/content?id=kotPYEqx7kMC&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE73dEcnwW-yoXg5mkv1zJu8o3dzAkyfAgFSRJyH7t_de74oWWsbBmRINMK1rg8y-6p1gIHC1sOOGn5Mvkk2OGbLm-zjl0-ZPtKp25mNAu6MBzvEQ_knFQBivP_oh6In48vOrbXrV',
    url: 'https://books.google.com/books/about/1984.html?id=kotPYEqx7kMC',
    description: 'Distopía que advirtió sobre el totalitarismo. Relevante hoy más que nunca.'
  },
  {
    id: 2,
    title: 'Harry Potter y la Piedra Filosofal',
    author: 'J.K. Rowling',
    image: 'https://http2.mlstatic.com/D_NQ_NP_2X_667243-MLV72067424214_102023-F.webp',
    url: 'https://www.google.co.ve/books/edition/Harry_Potter_y_la_piedra_filosofal/2zgRDXFWkm8C?hl=es&gbpv=0',
    description: 'El inicio de la saga mágica. Harry descubre su herencia como mago y comienza su aventura en Hogwarts.'
  },
  {
    id: 3,
    title: 'Las Aventuras de la Mano Negra',
    author: 'Edgar Allan Poe',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQB_YOKnDW8Cvu-6bHo66D3eJRdKyYfWdoX_g&s',
    url: 'https://www.google.co.ve/books/edition/_/5EHVcQAACAAJ?hl=es&sa=X&ved=2ahUKEwirlKOp1L6PAxXTQzABHT9sBZ8Q7_IDegQIDBAC',
    description: 'Colección de relatos de terror y misterio del maestro Edgar Allan Poe. Historias que exploran lo macabro y lo sobrenatural.'
  },
  {
    id: 4,
    title: 'El Principito',
    author: 'Antoine de Saint-Exupéry',
    image: 'https://booksflea.com/wp-content/uploads/2024/02/phEKio6FCv-scaled-1.webp',
    url: 'https://www.google.co.ve/books/edition/El_Principito/QAwbCgAAQBAJ?hl=es&gbpv=0',
    description: 'Fábula filosófica sobre la infancia, la amistad y el amor. Un clásico atemporal que invita a la reflexión.'
  }
];

</script>

<style scoped>
/* Mejora de enfoque para accesibilidad */
a:focus-visible {
  outline: none;
  box-shadow: 0 0 0 4px rgba(2, 132, 199, 0.3);
}
</style>
