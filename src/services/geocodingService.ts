import type { GeocodingResponse, HasilGeocoding } from "../types/geocoding";

const BASE_URL = "https://geocoding-api.open-meteo.com/v1/search";

export async function cariKota(nama: string): Promise<HasilGeocoding[]> {
  const params = new URLSearchParams({
    name: nama,
    count: "5",
    language: "id",
    format: "json",
  });
  const response = await fetch(`${BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Gagal memuat data (status ${response.status})`);
  }

  const data: GeocodingResponse = await response.json();
  return data.results ?? [];
}
