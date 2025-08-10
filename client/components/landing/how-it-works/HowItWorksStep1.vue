<template>
  <!-- Paso 1 (Estático) -->
  <div v-if="!isDemoMode" class="overflow-hidden rounded-xl p-6 backdrop-blur-sm border shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)]" :style="cardStyle">
    <div class="pt-2">
      <span class="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] rounded-full px-3 py-1" :style="pillStyle">
        Paso 1 <CheckIcon class="h-3.5 w-3.5" />
      </span>
    </div>
    <div class="pb-2 mt-3">
      <h3 class="flex items-center gap-2 font-semibold text-lg" :style="{ color: hexA('#FFFFFF', 0.9) }">
        <UserPlusIcon class="h-5 w-5" :style="{ color: hexA('#FFFFFF', 0.72) }" />
        Crea tu cuenta
      </h3>
    </div>
    <div class="space-y-4">
      <div class="space-y-2">
        <div class="h-10 w-full rounded-md px-3 flex items-center" :style="ghostInputStyle">Nombre de usuario</div>
        <div class="h-10 w-full rounded-md px-3 flex items-center" :style="ghostInputStyle">Correo electrónico</div>
        <div class="h-10 w-full rounded-md px-3 flex items-center" :style="ghostInputStyle">Contraseña</div>
      </div>
      <p class="text-sm" :style="{ color: hexA('#FFFFFF', 0.72) }">
        Regístrate y gestiona tu perfil para empezar a personalizar tu experiencia.
      </p>
    </div>
  </div>

  <!-- Paso 1 (Demo) -->
  <div
    v-else
    class="overflow-hidden rounded-xl p-6 backdrop-blur-sm border shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)]"
    :style="cardStyle"
    :class="{ 'md:col-span-3': demoStep === 1 }"
  >
    <div class="pt-2">
      <span class="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] rounded-full px-3 py-1" :style="pillStyle">
        Paso 1 <CheckIcon class="h-3.5 w-3.5" />
      </span>
    </div>
    <div class="pb-2 mt-3">
      <h3 class="flex items-center gap-2 font-semibold text-lg" :style="{ color: hexA('#FFFFFF', 0.9) }">
        <UserPlusIcon class="h-5 w-5" :style="{ color: hexA('#FFFFFF', 0.72) }" />
        Crea tu cuenta
      </h3>
    </div>
    <div class="space-y-4">
      <div class="space-y-2">
        <input
          type="text"
          :value="username"
          @input="$emit('update:username', ($event.target as HTMLInputElement).value)"
          placeholder="Nombre de usuario"
          class="h-10 w-full rounded-md px-3 bg-transparent placeholder-white/60 focus:outline-none"
          :style="ghostInputStyle"
        />
        <input
          type="email"
          :value="email"
          @input="$emit('update:email', ($event.target as HTMLInputElement).value)"
          placeholder="Correo electrónico"
          class="h-10 w-full rounded-md px-3 bg-transparent placeholder-white/60 focus:outline-none"
          :style="ghostInputStyle"
        />
        <input
          type="password"
          :value="password"
          @input="$emit('update:password', ($event.target as HTMLInputElement).value)"
          placeholder="Contraseña"
          class="h-10 w-full rounded-md px-3 bg-transparent placeholder-white/60 focus:outline-none"
          :style="ghostInputStyle"
        />
      </div>
      <p class="text-sm" :style="{ color: hexA('#FFFFFF', 0.72) }">
        Regístrate y gestiona tu perfil para empezar a personalizar tu experiencia.
      </p>
      <div v-if="demoStep === 1" class="text-center">
        <button
          @click="$emit('next')"
          class="mt-4 px-6 py-3 rounded-md font-semibold bg-white text-black transition-transform transform hover:scale-105"
        >
          Registrarse
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check as CheckIcon, UserPlus as UserPlusIcon } from 'lucide-vue-next';
import { defineProps, toRefs } from 'vue';
import { hexA, cardStyle, pillStyle, ghostInputStyle } from '../../../utils/styleUtils';

const props = defineProps({
  isDemoMode: Boolean,
  demoStep: Number,
  username: String,
  email: String,
  password: String,
});

defineEmits(['update:username', 'update:email', 'update:password', 'next']);
</script>