<template>
  <article class="station-card">
    <header>
      <h3>{{ station.name }}</h3>
      <span class="tag">{{ station.genre }}</span>
    </header>

    <p class="meta">{{ station.country }} · {{ station.language }}</p>

    <div class="actions">
      <button type="button" @click="$emit('listen', station)">Listen</button>
      <button
        type="button"
        class="secondary"
        :disabled="favoriteBusy"
        @click="$emit(isFavorite ? 'remove-favorite' : 'add-favorite', station)"
      >
        {{ isFavorite ? 'Remove Favorite' : 'Save Favorite' }}
      </button>
      <a :href="station.homepage" target="_blank" rel="noreferrer">Website</a>
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
