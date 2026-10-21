import { ambilDatabase } from "../db/database";
import type { DataCuacaLengkap, DataKualitasUdara } from "../types/weather";
import type {
  DataTersimpan,
  KotaUntukCache,
  RingkasanKotaTersimpan,
} from "../types/cache";

interface BarisCache {
  kunci: string;
  kota_id: number;
  nama_kota: string;
  latitude: number;
  longitude: number;
  cuaca_json: string;
  aqi_json: string;
  disimpan_pada: number;
}

type BarisRingkasan = Omit<BarisCache, "cuaca_json" | "aqi_json">;

// Pembulatan membuat GPS yang sedikit bergeser tetap memakai cache yang sama.
export function buatKunci(latitude: number, longitude: number): string {
  return `${latitude.toFixed(2)},${longitude.toFixed(2)}`;
}

export async function simpanCache(
  kota: KotaUntukCache,
  cuaca: DataCuacaLengkap,
  kualitasUdara: DataKualitasUdara
): Promise<void> {
  const db = await ambilDatabase();

  await db.runAsync(
    `INSERT OR REPLACE INTO cache_cuaca
      (kunci, kota_id, nama_kota, latitude, longitude, cuaca_json, aqi_json, disimpan_pada)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      buatKunci(kota.latitude, kota.longitude),
      kota.id,
      kota.nama,
      kota.latitude,
      kota.longitude,
      JSON.stringify(cuaca),
      JSON.stringify(kualitasUdara),
      Date.now(),
    ]
  );
}

export async function ambilCache(
  latitude: number,
  longitude: number
): Promise<DataTersimpan | null> {
  const db = await ambilDatabase();
  const baris = await db.getFirstAsync<BarisCache>(
    "SELECT * FROM cache_cuaca WHERE kunci = ?",
    [buatKunci(latitude, longitude)]
  );

  if (!baris) return null;

  return {
    cuaca: JSON.parse(baris.cuaca_json) as DataCuacaLengkap,
    kualitasUdara: JSON.parse(baris.aqi_json) as DataKualitasUdara,
    disimpanPada: baris.disimpan_pada,
  };
}

export async function daftarKotaTersimpan(): Promise<RingkasanKotaTersimpan[]> {
  const db = await ambilDatabase();
  const baris = await db.getAllAsync<BarisRingkasan>(`
    SELECT kunci, kota_id, nama_kota, latitude, longitude, disimpan_pada
    FROM cache_cuaca
    ORDER BY disimpan_pada DESC
    LIMIT 5
  `);

  return baris.map((item) => ({
    kunci: item.kunci,
    id: item.kota_id,
    nama: item.nama_kota,
    latitude: item.latitude,
    longitude: item.longitude,
    disimpanPada: item.disimpan_pada,
  }));
}

export async function bersihkanCacheLama(batasUmurMs: number): Promise<void> {
  const db = await ambilDatabase();
  await db.runAsync("DELETE FROM cache_cuaca WHERE disimpan_pada < ?", [
    Date.now() - batasUmurMs,
  ]);
}

export async function hapusSemuaCache(): Promise<void> {
  const db = await ambilDatabase();
  await db.runAsync("DELETE FROM cache_cuaca");
}

export async function hapusCacheKota(kunci: string): Promise<void> {
  const db = await ambilDatabase();
  await db.runAsync("DELETE FROM cache_cuaca WHERE kunci = ?", [kunci]);
}
