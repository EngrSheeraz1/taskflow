const BASE_URL = import.meta.env.VITE_API_URL;

export async function httpClient(endpoint, options = {}) {
  const response = await fetch(`${BASE_URL}/${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  // If it's a DELETE request, there might be no JSON response
  if (response.status === 204) return null;

  return response.json();
}