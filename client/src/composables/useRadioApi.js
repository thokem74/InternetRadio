const defaultHeaders = {
  'Content-Type': 'application/json'
};

async function parseResponse(response) {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

function buildQuery(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

export async function fetchStations(params = {}) {
  const response = await fetch(`/api/stations${buildQuery(params)}`);
  return parseResponse(response);
}

export async function fetchFavorites() {
  const response = await fetch('/api/favorites');
  return parseResponse(response);
}

export async function addFavoriteStation(station) {
  const payload = {
    stationuuid: station.stationuuid,
    name: station.name,
    url_stream: station.url_stream,
    url_homepage: station.url_homepage,
    url_favicon: station.url_favicon,
    tags: station.tags,
    iso_3166_1: station.iso_3166_1,
    iso_3166_2: station.iso_3166_2,
    iso_639: station.iso_639,
    geo_lat: station.geo_lat,
    geo_long: station.geo_long
  };

  const response = await fetch('/api/favorites', {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(payload)
  });

  return parseResponse(response);
}

export async function removeFavoriteStation(stationuuid) {
  const response = await fetch(`/api/favorites/${stationuuid}`, {
    method: 'DELETE'
  });

  return parseResponse(response);
}
