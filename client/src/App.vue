<template>
  <main class="layout">
    <section class="player-panel">
      <h1>Internet Radio Explorer</h1>
      <p class="subtitle">Discover and play world radio streams in one place.</p>

      <div v-if="currentStation" class="now-playing">
        <h2>Now Playing</h2>
        <p>{{ currentStation.name }} ({{ currentStation.country }})</p>
      </div>
      <p v-else class="hint">Choose a station below to start listening.</p>

      <audio ref="audioRef" controls autoplay class="player"></audio>

      <div class="filters">
        <label>
          Search
          <input v-model="searchTerm" type="text" placeholder="station, country, genre" />
        </label>
        <label>
          Genre
          <select v-model="genreFilter">
            <option value="all">All</option>
            <option v-for="genre in availableGenres" :key="genre" :value="genre">{{ genre }}</option>
          </select>
        </label>
      </div>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </section>

    <section>
      <h2>Stations</h2>
      <div class="grid">
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
