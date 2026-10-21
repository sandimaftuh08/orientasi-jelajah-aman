// src/services/weatherService.ts
import type { DataCuacaLengkap } from "../types/weather";

const BASE_URL = "https://api.open-meteo.com/v1/forecast";
const BATAS_WAKTU_MS = 3000;

export async function ambilCuaca(
  latitude: number,
  longitude: number
): Promise<DataCuacaLengkap> {
  const url = `${BASE_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), BATAS_WAKTU_MS);

  try {
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`Gagal memuat cuaca (status ${response.status})`);
    }

    const data = await response.json();

    return {
      saatIni: {
        suhu: data.current.temperature_2m,
        kodeCuaca: data.current.weather_code,
        kecepatanAngin: data.current.wind_speed_10m,
        waktu: data.current.time,
      },
      harian: {
        tanggal: data.daily.time,
        suhuMaksimal: data.daily.temperature_2m_max,
        suhuMinimal: data.daily.temperature_2m_min,
        kodeCuaca: data.daily.weather_code,
      },
    };
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("Permintaan cuaca melebihi batas waktu, coba lagi");
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
