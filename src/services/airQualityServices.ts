// src/services/airQualityService.ts
import type { DataKualitasUdara } from "../types/weather";

const BASE_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";

export async function ambilKualitasUdara(
  latitude: number,
  longitude: number
): Promise<DataKualitasUdara> {
  const url = `${BASE_URL}?latitude=${latitude}&longitude=${longitude}&current=european_aqi,pm2_5,pm10`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Gagal memuat kualitas udara (status ${response.status})`);
  }

  const data = await response.json();

  return {
    indeksAQI: data.current.european_aqi,
    pm25: data.current.pm2_5,
    pm10: data.current.pm10,
  };
}
