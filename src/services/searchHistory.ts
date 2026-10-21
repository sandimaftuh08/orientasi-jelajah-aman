import AsyncStorage from "@react-native-async-storage/async-storage";
import type { HasilGeocoding } from "../types/geocoding";

const HISTORY_KEY = "jelajah-aman:search-history";

export async function bacaRiwayatKota(): Promise<HasilGeocoding[]> {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as HasilGeocoding[]).slice(0, 10) : [];
  } catch {
    return [];
  }
}

export async function simpanRiwayatKota(kota: HasilGeocoding): Promise<void> {
  const riwayat = await bacaRiwayatKota();
  const diperbarui = [
    kota,
    ...riwayat.filter((item) => item.id !== kota.id),
  ].slice(0, 10);
  const raw = JSON.stringify(diperbarui);

  try {
    await AsyncStorage.setItem(HISTORY_KEY, raw);
  } catch {
    // Pencarian dan cuaca tetap berfungsi jika penyimpanan lokal tidak tersedia.
  }
}
