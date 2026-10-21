// src/services/favoritStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { KotaFavorit } from "../types/favorit";

const KUNCI_PENYIMPANAN = "@jelajah_aman:favorit";

export async function ambilSemuaFavorit(): Promise<KotaFavorit[]> {
  try {
    const json = await AsyncStorage.getItem(KUNCI_PENYIMPANAN);
    return json ? JSON.parse(json) : [];
  } catch (error) {
    console.error("Gagal mengambil data favorit:", error);
    return [];
  }
}

export async function tambahFavorit(kota: KotaFavorit): Promise<void> {
  try {
    const daftar = await ambilSemuaFavorit();
    const sudahAda = daftar.some((k) => k.id === kota.id);

    if (sudahAda) return;

    const daftarBaru = [...daftar, kota];
    await AsyncStorage.setItem(KUNCI_PENYIMPANAN, JSON.stringify(daftarBaru));
  } catch (error) {
    console.error("Gagal menambah data favorit:", error);
  }
}

export async function hapusFavorit(id: number): Promise<void> {
  try {
    const daftar = await ambilSemuaFavorit();
    const daftarBaru = daftar.filter((k) => k.id !== id);

    await AsyncStorage.setItem(KUNCI_PENYIMPANAN, JSON.stringify(daftarBaru));
  } catch (error) {
    console.error("Gagal menghapus data favorit:", error);
  }
}