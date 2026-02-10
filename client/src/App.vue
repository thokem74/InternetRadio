<template>
  <main
    class="min-h-screen bg-ink-900 text-slate-100"
  >
    <div class="absolute inset-0 -z-10 bg-radial-spot" aria-hidden="true"></div>
    <div class="absolute inset-0 -z-10 bg-radial-pink" aria-hidden="true"></div>

    <div class="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:grid-cols-[minmax(280px,360px)_1fr]">
      <section
        class="rounded-2xl border border-ink-600/70 bg-ink-800/80 p-5 shadow-glow backdrop-blur"
      >
        <div class="space-y-2">
          <p class="text-xs uppercase tracking-[0.28em] text-neon-cyan/80">Live catalog</p>
          <h1 class="font-display text-2xl font-semibold tracking-tight text-white md:text-3xl">
            Internet Radio Explorer
          </h1>
          <p class="text-sm text-slate-300">
            Discover and play world radio streams in one place.
          </p>
        </div>

        <div class="mt-5 rounded-xl border border-ink-600/70 bg-ink-900/60 p-4">
          <h2 class="text-sm font-semibold uppercase tracking-widest text-slate-300">Now playing</h2>
          <p v-if="currentStation" class="mt-2 text-lg font-semibold text-white">
            {{ currentStation.name }}
          </p>
          <p v-if="currentStation" class="text-sm text-slate-400">
            {{ currentStation.country }} · {{ currentStation.language }}
          </p>
          <p v-else class="mt-2 text-sm text-slate-400">
            Choose a station below to start listening.
          </p>
        </div>

        <audio ref="audioRef" controls autoplay class="mt-4 w-full"></audio>

        <div class="mt-5 space-y-3">
          <label class="text-xs font-semibold uppercase tracking-widest text-slate-300">
            Search
            <input
              v-model="searchTerm"
              type="text"
              placeholder="station, country, genre"
              class="mt-2 w-full rounded-xl border border-ink-600/70 bg-ink-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/40"
            />
          </label>
          <label class="text-xs font-semibold uppercase tracking-widest text-slate-300">
            Genre
            <select
              v-model="genreFilter"
              class="mt-2 w-full rounded-xl border border-ink-600/70 bg-ink-900/70 px-3 py-2 text-sm text-slate-100 focus:border-neon-pink focus:outline-none focus:ring-2 focus:ring-neon-pink/40"
            >
              <option value="all">All</option>
              <option v-for="genre in availableGenres" :key="genre" :value="genre">{{ genre }}</option>
            </select>
          </label>
        </div>

        <p v-if="errorMessage" class="mt-4 text-sm text-rose-300">
          {{ errorMessage }}
        </p>
      </section>

      <section class="space-y-4">
        <div class="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 class="font-display text-xl font-semibold text-white">Stations</h2>
            <p class="text-sm text-slate-400">Scan by genre, country, or language.</p>
          </div>
          <div class="rounded-full border border-ink-600/70 bg-ink-800/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-neon-cyan">
            {{ filteredStations.length }} results
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StationCard
            v-for="station in filteredStations"
            :key="station.id"
            :station="station"
            :is-favorite="favoriteIds.has(station.id)"
            :favorite-busy="favoriteLoading"
            @listen="playStation"
            @add-favorite="saveFavorite"
            @remove-favorite="deleteFavorite"
          />
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import StationCard from './components/StationCard.vue';
import { addFavoriteStation, fetchFavorites, fetchStations, removeFavoriteStation } from './composables/useRadioApi';

const stations = ref([]);
const favoriteIds = ref(new Set());
const currentStation = ref(null);
const searchTerm = ref('');
const genreFilter = ref('all');
const errorMessage = ref('');
const favoriteLoading = ref(false);
const audioRef = ref(null);

const availableGenres = computed(() => {
  const genres = new Set(stations.value.map((station) => station.genre));
  return [...genres].sort();
});

const filteredStations = computed(() => {
  const term = searchTerm.value.trim().toLowerCase();

  return stations.value.filter((station) => {
    const genreMatches = genreFilter.value === 'all' || station.genre === genreFilter.value;
    const text = `${station.name} ${station.country} ${station.language} ${station.genre}`.toLowerCase();
    const termMatches = !term || text.includes(term);
    return genreMatches && termMatches;
  });
});

function playStation(station) {
  currentStation.value = station;
  if (audioRef.value) {
    audioRef.value.src = station.streamUrl;
  }
}

async function loadData() {
  try {
    errorMessage.value = '';
    const [stationsData, favoritesData] = await Promise.all([fetchStations(), fetchFavorites()]);
    stations.value = stationsData;
    favoriteIds.value = new Set(favoritesData.map((favorite) => favorite.stationId));
  } catch (error) {
    errorMessage.value = 'Could not load station data. Please check the server.';
    console.error(error);
  }
}

async function saveFavorite(station) {
  try {
    favoriteLoading.value = true;
    await addFavoriteStation(station);
    favoriteIds.value.add(station.id);
  } catch (error) {
    errorMessage.value = 'Unable to save favorite right now.';
    console.error(error);
  } finally {
    favoriteLoading.value = false;
  }
}

async function deleteFavorite(station) {
  try {
    favoriteLoading.value = true;
    await removeFavoriteStation(station.id);
    favoriteIds.value.delete(station.id);
  } catch (error) {
    errorMessage.value = 'Unable to remove favorite right now.';
    console.error(error);
  } finally {
    favoriteLoading.value = false;
  }
}

onMounted(() => {
  loadData();
});
</script>
