<template>
  <article
    class="group rounded-2xl border border-ink-600/70 bg-ink-800/70 p-4 shadow-[0_12px_40px_rgba(8,12,24,0.55)] transition hover:-translate-y-1 hover:border-neon-cyan/60"
  >
    <header class="flex items-start justify-between gap-3">
      <div>
        <h3 class="text-base font-semibold text-white">
          {{ station.name }}
        </h3>
        <p class="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">
          {{ station.country }} · {{ station.language }}
        </p>
      </div>
      <span
        class="rounded-full border border-neon-pink/40 bg-neon-pink/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-neon-pink"
      >
        {{ station.genre }}
      </span>
    </header>

    <div class="mt-4 flex flex-wrap gap-2">
      <button
        type="button"
        class="flex-1 rounded-xl border border-neon-cyan/60 bg-neon-cyan/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-neon-cyan transition hover:bg-neon-cyan/20"
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
      <a
        :href="station.homepage"
        target="_blank"
        rel="noreferrer"
        class="w-full rounded-xl border border-ink-600/70 bg-ink-900/60 px-3 py-2 text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 transition hover:border-neon-violet/60 hover:text-neon-violet"
      >
        Website
      </a>
    </div>
  </article>
</template>

<script setup>
defineProps({
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
</script>
