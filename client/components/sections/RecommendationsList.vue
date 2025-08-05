<script setup lang="ts">
import type { PropType } from 'vue';
import type { RecommendationItem } from '~/types/Recommendations';

const props = defineProps({
  items: {
    type: Array as PropType<RecommendationItem[]>,
    required: true,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String as PropType<string | null>,
    default: null
  }
});

const emit = defineEmits<{
  (e: 'remove', index: number): void
  (e: 'retry'): void
}>();

function onRetry() {
  emit('retry');
}

function onRemove(index: number) {
  emit('remove', index);
}

// Align with RecommendationItem definition:
// - coverUrl
// - releaseDate
// - externalSource
// - avgRating
function getImage(item: RecommendationItem): string {
  // Fallback to placeholder if no coverUrl
  return item.coverUrl || '/placeholder.svg';
}

function getYear(item: RecommendationItem): string | null {
  if (item.releaseDate) {
    const d = new Date(item.releaseDate);
    const year = d.getFullYear();
    return Number.isFinite(year) ? String(year) : null;
  }
  // Attempt parse from description like "Artist - Album (2012)"
  const match = item.description?.match(/(19|20)\d{2}/);
  return match ? match[0] : null;
}

function getSource(item: RecommendationItem): string | null {
  return item.externalSource || null;
}

function getRating(item: RecommendationItem): string | null {
  if (typeof item.avgRating === 'number') return `${item.avgRating}`;
  if (typeof item.avgRating === 'string') return item.avgRating;
  return null;
}

function openExternal(item: RecommendationItem) {
  if (item.externalUrl) {
    window.open(item.externalUrl, '_blank', 'noopener,noreferrer');
  }
}
</script>

<template>
  <section class="w-full">
    <!-- Error State -->
    <div v-if="error" class="mb-4 rounded-md border border-red-500/40 bg-red-500/10 p-4 text-red-200">
      <div class="flex items-start justify-between gap-4">
        <p class="text-sm">{{ error }}</p>
        <button
          type="button"
          class="rounded-md bg-red-500/20 px-3 py-1.5 text-sm font-medium text-red-100 hover:bg-red-500/30 focus:outline-none focus:ring-2 focus:ring-red-400/50"
          aria-label="Retry fetching recommendations"
          @click="onRetry"
        >
          Retry
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="n in 6" :key="n" class="animate-pulse rounded-lg bg-white/5 p-4 backdrop-blur-md">
        <div class="mb-3 h-40 w-full rounded-md bg-white/10"></div>
        <div class="mb-2 h-5 w-3/4 rounded bg-white/10"></div>
        <div class="mb-2 h-4 w-1/2 rounded bg-white/10"></div>
        <div class="h-4 w-2/3 rounded bg-white/10"></div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!error && !loading && items.length === 0" class="rounded-lg border border-white/10 bg-white/5 p-8 text-center text-white/70">
      No recommendations yet. Choose a category and submit a search.
    </div>

    <!-- Results -->
    <ul v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <li
        v-for="(item, index) in items"
        :key="item.id ?? item.externalId ?? index"
        class="group relative overflow-hidden rounded-lg border border-white/10 bg-white/5 shadow-sm transition hover:border-white/20"
      >
        <div class="flex h-full flex-col">
          <div class="relative">
            <button
              type="button"
              class="block w-full overflow-hidden"
              :aria-label="item.externalUrl ? 'Open ' + (item.title || 'item') + ' in new tab' : 'No external link available'"
              @click="openExternal(item)"
            >
              <img
                :src="getImage(item)"
                :alt="item.title || 'Cover'"
                class="h-44 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                @error="(e: Event) => ((e.target as HTMLImageElement).src = '/placeholder.svg')"
              />
            </button>

            <div class="absolute right-2 top-2">
              <button
                type="button"
                class="rounded-md bg-black/50 px-2 py-1 text-xs text-white opacity-80 shadow hover:bg-black/60 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/40"
                @click="onRemove(index)"
                :aria-label="`Remove ${item.title || 'item'}`"
                title="Remove"
              >
                Remove
              </button>
            </div>
          </div>

          <div class="flex flex-1 flex-col p-4">
            <h3 class="mb-1 line-clamp-2 text-base font-semibold text-white">
              <template v-if="item.externalUrl">
                <a
                  :href="item.externalUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="hover:underline"
                >{{ item.title }}</a>
              </template>
              <template v-else>{{ item.title }}</template>
            </h3>

            <p v-if="item.description" class="mb-3 line-clamp-2 text-sm text-white/70">
              {{ item.description }}
            </p>

            <div class="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/60">
              <span v-if="item.type" class="rounded bg-white/10 px-2 py-0.5">{{ item.type }}</span>
              <span v-if="getSource(item)" class="rounded bg-white/10 px-2 py-0.5">{{ getSource(item) }}</span>
              <span v-if="getYear(item)" class="rounded bg-white/10 px-2 py-0.5">{{ getYear(item) }}</span>
              <span v-if="getRating(item)" class="rounded bg-white/10 px-2 py-0.5">★ {{ getRating(item) }}</span>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>