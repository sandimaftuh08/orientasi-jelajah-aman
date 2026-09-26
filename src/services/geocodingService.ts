// src/services/geocodingService.ts
import { GeocodingResponse, HasilGeocoding } from "../types/geocoding";

const BASE_URL = "https://geocoding-api.open-meteo.com/v1/search";

export async function cariKota(nama: string): Promise<HasilGeocoding[]> {
    const url =
`${BASE_URL}?name=${encodeURIComponent(nama)}&count=5&language=id&format=jso
n`;
    const response = await fetch(url);

if (!response.ok) {
    throw new Error(`Gagal memuat data (status ${response.status})`);
    }
const data: GeocodingResponse = await response.json();
return data.results ?? [];
}