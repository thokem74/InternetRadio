<template>
  <main class="min-h-screen bg-ink-900 text-slate-100">
    <div class="absolute inset-0 -z-10 bg-radial-spot" aria-hidden="true"></div>
    <div class="absolute inset-0 -z-10 bg-radial-pink" aria-hidden="true"></div>

    <div class="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:grid-cols-[minmax(280px,360px)_1fr]">
      <section class="rounded-2xl border border-ink-600/70 bg-ink-800/80 p-5 shadow-glow backdrop-blur">
        <div class="space-y-2">
          <p class="text-xs uppercase tracking-[0.28em] text-neon-cyan/80">Live catalog</p>
          <h1 class="font-display text-2xl font-semibold tracking-tight text-white md:text-3xl">
            Internet Radio Explorer
          </h1>
          <p class="text-sm text-slate-300">Discover and play world radio streams in one place.</p>
        </div>

        <div class="mt-5 rounded-xl border border-ink-600/70 bg-ink-900/60 p-4">
          <h2 class="text-sm font-semibold uppercase tracking-widest text-slate-300">Now playing</h2>
          <div v-if="currentStation" class="mt-3 flex items-start gap-4">
            <img
              v-if="playerHasFavicon"
              :key="currentStation.stationuuid"
              :src="currentStation.url_favicon"
              :alt="`${currentStation.name} favicon`"
              class="h-20 w-20 shrink-0 rounded-lg border border-ink-600/60 object-cover"
              loading="lazy"
              @error="playerHasFavicon = false"
            />
            <div
              v-else
              class="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-ink-600/60 bg-ink-800/70 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400"
            >
              No image
            </div>
            <div class="min-w-0 flex-1">
              <p class="break-words text-base font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.28)]">
                {{ currentStation.name }}
              </p>
              <p class="break-words text-sm text-slate-400">
                {{ currentStation.iso_3166_1 || 'N/A' }} · {{ currentStation.iso_639 || 'N/A' }}
              </p>
              <div class="mt-2 flex flex-wrap gap-2">
                <span
                  v-for="tag in currentStationTags"
                  :key="tag"
                  class="rounded-full border border-neon-cyan/60 bg-neon-cyan/15 px-0.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-neon-cyan shadow-[0_0_10px_rgba(34,211,238,0.24)]"
                >
                  {{ tag }}
                </span>
              </div>
              <p class="mt-2 text-sm text-slate-200">
                <a
                  v-if="currentStation.url_homepage"
                  :href="currentStation.url_homepage"
                  target="_blank"
                  rel="noreferrer"
                  class="text-neon-cyan hover:underline"
                >
                  Homepage
                </a>
                <span v-else class="text-slate-400">N/A</span>
              </p>
            </div>
          </div>
          <p v-else class="mt-2 text-sm text-slate-400">Choose a station below to start listening.</p>
        </div>

        <audio ref="audioRef" controls autoplay class="mt-4 w-full"></audio>

        <div class="mt-5 space-y-3">
          <label class="text-xs font-semibold uppercase tracking-widest text-slate-300">
            Search
            <input
              v-model="stationFilter"
              type="text"
              placeholder="station name"
              class="mt-2 w-full rounded-xl border border-ink-600/70 bg-ink-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/40"
              @keyup.enter="applyFilters"
            />
          </label>

          <label class="text-xs font-semibold uppercase tracking-widest text-slate-300">
            Tag
            <input
              v-model="tagFilter"
              type="text"
              placeholder="rock"
              class="mt-2 w-full rounded-xl border border-ink-600/70 bg-ink-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-neon-pink focus:outline-none focus:ring-2 focus:ring-neon-pink/40"
            />
          </label>

          <label class="text-xs font-semibold uppercase tracking-widest text-slate-300">
            Country Code (ISO 3166-1)
            <input
              v-model="countryCodeFilter"
              type="text"
              placeholder="US"
              class="mt-2 w-full rounded-xl border border-ink-600/70 bg-ink-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-neon-violet focus:outline-none focus:ring-2 focus:ring-neon-violet/40"
            />
          </label>

          <label class="text-xs font-semibold uppercase tracking-widest text-slate-300">
            Language Code (ISO 639)
            <input
              v-model="languageCodeFilter"
              type="text"
              placeholder="en"
              class="mt-2 w-full rounded-xl border border-ink-600/70 bg-ink-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/40"
            />
          </label>

          <div class="flex gap-2">
            <button
              type="button"
              class="flex-1 rounded-xl border border-neon-cyan/60 bg-neon-cyan/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-neon-cyan transition hover:bg-neon-cyan/20"
              @click="applyFilters"
            >
              Apply
            </button>
            <button
              type="button"
              class="flex-1 rounded-xl border border-ink-600/70 bg-ink-900/60 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 transition hover:border-neon-pink/60 hover:text-neon-pink"
              @click="clearFilters"
            >
              Clear
            </button>
          </div>
        </div>

        <p v-if="errorMessage" class="mt-4 text-sm text-rose-300">{{ errorMessage }}</p>
      </section>

      <section class="space-y-4">
        <div class="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 class="font-display text-xl font-semibold text-white">Stations</h2>
            <p class="text-sm text-slate-400">Filter by station name, tags, and ISO codes.</p>
          </div>
          <div class="rounded-full border border-ink-600/70 bg-ink-800/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-neon-cyan">
            {{ pagination.totalItems }} results
          </div>
        </div>

        <div class="flex items-center justify-between rounded-xl border border-ink-600/70 bg-ink-800/60 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em]">
          <button
            type="button"
            class="rounded-lg border border-ink-600/70 bg-ink-900/70 px-3 py-2 text-slate-300 transition hover:border-neon-cyan/70 hover:text-neon-cyan disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="!pagination.hasPrevPage || stationLoading"
            @click="goToPreviousPage"
          >
            Previous
          </button>
          <span class="text-slate-300">Page {{ pagination.page }} / {{ pagination.totalPages }}</span>
          <button
            type="button"
            class="rounded-lg border border-ink-600/70 bg-ink-900/70 px-3 py-2 text-slate-300 transition hover:border-neon-cyan/70 hover:text-neon-cyan disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="!pagination.hasNextPage || stationLoading"
            @click="goToNextPage"
          >
            Next
          </button>
        </div>

        <p v-if="stationLoading" class="text-sm text-slate-400">Loading stations...</p>

        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StationCard
            v-for="station in stations"
            :key="station.stationuuid"
            :station="station"
            :is-favorite="favoriteIds.has(station.stationuuid)"
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
import { computed, onMounted, reactive, ref } from 'vue';
import StationCard from './components/StationCard.vue';
import { addFavoriteStation, fetchFavorites, fetchStations, removeFavoriteStation } from './composables/useRadioApi';

const stations = ref([]);
const favoriteIds = ref(new Set());
const currentStation = ref(null);
const stationFilter = ref('');
const tagFilter = ref('');
const countryCodeFilter = ref('');
const languageCodeFilter = ref('');
const errorMessage = ref('');
const favoriteLoading = ref(false);
const stationLoading = ref(false);
const audioRef = ref(null);
const playerHasFavicon = ref(false);

const pagination = reactive({
  page: 1,
  limit: 50,
  totalItems: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false
});

const currentStationTags = computed(() => {
  if (!currentStation.value?.tags) {
    return ['untagged'];
  }

  const normalizedTags = currentStation.value.tags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

  return normalizedTags.length ? normalizedTags : ['untagged'];
});

function stationQueryParams() {
  return {
    page: pagination.page,
    limit: pagination.limit,
    q: stationFilter.value.trim(),
    tag: tagFilter.value.trim(),
    iso_3166_1: countryCodeFilter.value.trim().toUpperCase(),
    iso_639: languageCodeFilter.value.trim().toLowerCase()
  };
}

function playStation(station) {
  currentStation.value = station;
  playerHasFavicon.value = Boolean(station.url_favicon);
  if (audioRef.value) {
    audioRef.value.src = station.url_stream;
  }
}

async function loadStations() {
  try {
    stationLoading.value = true;
    errorMessage.value = '';

    const data = await fetchStations(stationQueryParams());

    stations.value = data.items;
    pagination.page = data.pagination.page;
    pagination.limit = data.pagination.limit;
    pagination.totalItems = data.pagination.totalItems;
    pagination.totalPages = data.pagination.totalPages;
    pagination.hasNextPage = data.pagination.hasNextPage;
    pagination.hasPrevPage = data.pagination.hasPrevPage;
  } catch (error) {
    errorMessage.value = 'Could not load station data. Please check the server.';
    console.error(error);
  } finally {
    stationLoading.value = false;
  }
}

async function loadFavorites() {
  try {
    const favoritesData = await fetchFavorites();
    favoriteIds.value = new Set(favoritesData.map((favorite) => favorite.stationuuid));
  } catch (error) {
    errorMessage.value = 'Could not load favorites right now.';
    console.error(error);
  }
}

function applyFilters() {
  pagination.page = 1;
  loadStations();
}

function clearFilters() {
  stationFilter.value = '';
  tagFilter.value = '';
  countryCodeFilter.value = '';
  languageCodeFilter.value = '';
  pagination.page = 1;
  loadStations();
}

function goToPreviousPage() {
  if (!pagination.hasPrevPage || stationLoading.value) {
    return;
  }

  pagination.page -= 1;
  loadStations();
}

function goToNextPage() {
  if (!pagination.hasNextPage || stationLoading.value) {
    return;
  }

  pagination.page += 1;
  loadStations();
}

async function saveFavorite(station) {
  try {
    favoriteLoading.value = true;
    await addFavoriteStation(station);
    favoriteIds.value.add(station.stationuuid);
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
    await removeFavoriteStation(station.stationuuid);
    favoriteIds.value.delete(station.stationuuid);
  } catch (error) {
    errorMessage.value = 'Unable to remove favorite right now.';
    console.error(error);
  } finally {
    favoriteLoading.value = false;
  }
}

onMounted(async () => {
  await Promise.all([loadStations(), loadFavorites()]);
});
</script>
