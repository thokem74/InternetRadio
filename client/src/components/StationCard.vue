<template>
  <article
    class="group rounded-2xl border border-ink-600/70 bg-ink-800/70 p-4 shadow-[0_12px_40px_rgba(8,12,24,0.55)] transition hover:-translate-y-1 hover:border-neon-cyan/60"
  >
    <header class="flex items-center gap-2">
      <img
        v-if="hasFavicon"
        :src="station.url_favicon"
        :alt="`${station.name} favicon`"
        class="h-7 w-7 rounded-md border border-ink-600/60 object-cover"
        loading="lazy"
        @error="hasFavicon = false"
      />
    </header>

    <div class="mt-3 space-y-2 text-sm text-slate-200">
      <p class="break-words text-base font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.28)]">
        {{ station.name || 'N/A' }}
      </p>
      <p class="break-words">
        {{ station.iso_3166_1 || 'N/A' }} · {{ station.iso_639 || 'N/A' }}
      </p>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="tag in stationTags"
          :key="tag"
          class="rounded-full border border-neon-cyan/60 bg-neon-cyan/15 px-0.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-neon-cyan shadow-[0_0_10px_rgba(34,211,238,0.24)]"
        >
          {{ tag }}
        </span>
      </div>
      <p class="break-all">
        <span class="font-semibold text-white"></span>
        <a
          v-if="station.url_homepage"
          :href="station.url_homepage"
          target="_blank"
          rel="noreferrer"
          class="ml-1 text-neon-cyan hover:underline"
        >
          Homepage
        </a>
        <span v-else class="ml-1 text-slate-400">N/A</span>
      </p>
    </div>

    <div class="mt-4 flex flex-wrap gap-2">
      <button
        type="button"
        class="flex-1 rounded-xl border border-neon-cyan/60 bg-neon-cyan/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-neon-cyan transition hover:bg-neon-cyan/20 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="!station.url_stream"
        @click="$emit('listen', station)"
      >
        Listen
      </button>
      <button
        type="button"
        class="flex-1 rounded-xl border border-neon-pink/60 bg-neon-pink/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-neon-pink transition hover:bg-neon-pink/20 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="favoriteBusy"
        @click="$emit(isFavorite ? 'remove-favorite' : 'add-favorite', station)"
      >
        {{ isFavorite ? 'Remove Favorite' : 'Save Favorite' }}
      </button>
    </div>
  </article>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  station: {
    type: Object,
    required: true
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  favoriteBusy: {
    type: Boolean,
    default: false
  }
});

const hasFavicon = ref(Boolean(props.station.url_favicon));
const stationTags = computed(() => {
  if (!props.station.tags) {
    return ['untagged'];
  }

  const normalizedTags = props.station.tags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

  return normalizedTags.length ? normalizedTags : ['untagged'];
});
</script>
