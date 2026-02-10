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

export async function fetchStations() {
  const response = await fetch('/api/stations');
  return parseResponse(response);
}

export async function fetchFavorites() {
  const response = await fetch('/api/favorites');
  return parseResponse(response);
}

export async function addFavoriteStation(station) {
  const payload = {
    stationId: station.id,
    name: station.name,
    country: station.country,
    language: station.language,
    genre: station.genre,
    streamUrl: station.streamUrl,
    homepage: station.homepage
  };

  const response = await fetch('/api/favorites', {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(payload)
  });

  return parseResponse(response);
}

export async function removeFavoriteStation(stationId) {
  const response = await fetch(`/api/favorites/${stationId}`, {
    method: 'DELETE'
  });

  return parseResponse(response);
}
