<template>
  <NuxtLink :to="href" class="block group">
    <div
      class="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xs transition-all duration-300 hover:shadow-md hover:border-white/20"
    >
      <div class="relative h-[320px] md:h-[360px] overflow-hidden">
        <img
          :src="image"
          :alt="title"
          class="object-cover w-full h-full"
        />
      </div>

      <div
        class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
        aria-hidden="true"
      />

      <div class="absolute top-3 right-3">
        <span :class="badgeClasses">{{ badge.text }}</span>
      </div>

      <div class="absolute bottom-0 left-0 right-0 p-5">
        <div class="flex items-center justify-between gap-3">
          <div class="space-y-1.5">
            <h3 class="text-lg font-semibold text-white leading-snug">
              {{ title }}
            </h3>
            <p class="text-sm text-zinc-200 line-clamp-2">{{ subtitle }}</p>
          </div>
          <div
            class="p-2 rounded-full bg-white/10 backdrop-blur-md group-hover:bg-white/20 transition-colors duration-300"
          >
            <ArrowUpRightIcon class="w-4 h-4 text-white group-hover:-rotate-12 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
import { computed } from 'vue'
import { ArrowUpRightIcon } from 'lucide-vue-next'

const props = defineProps({
  title: {
    type: String,
    default: "Modern Design Systems",
  },
  subtitle: {
    type: String,
    default: "Explore the fundamentals of contemporary UI design",
  },
  image: {
    type: String,
    default: "/generic-card-design.png",
  },
  badge: {
    type: Object,
    default: () => ({ text: "New", variant: "orange" }),
  },
  href: {
    type: String,
    default: "#",
  },
})

const badgeBase = "px-2.5 py-1 rounded-lg text-xs font-medium backdrop-blur-md shadow-xs border"

const badgeClasses = computed(() => {
  const variants = {
    orange: "bg-white/90 text-zinc-800 border-white/20",
    pink: "bg-rose-100/90 text-rose-900 border-rose-200/50",
    indigo: "bg-violet-100/90 text-violet-900 border-violet-200/50",
  }
  return `${badgeBase} ${variants[props.badge.variant]}`
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>