import { ambilKualitasUdara } from "./airQualityServices";
import { ambilCache, simpanCache } from "./cacheRepository";
import { ambilCuaca } from "./weatherServices";
import type { HasilCuacaOffline, KotaUntukCache } from "../types/cache";

export const TTL_SEGAR_MS = 30 * 60 * 1000;
export const BATAS_CACHE_MS = 7 * 24 * 60 * 60 * 1000;

interface OpsiAmbil {
  paksaPerbarui?: boolean;
}

export async function ambilCuacaOfflineFirst(
  kota: KotaUntukCache,
  opsi: OpsiAmbil = {}
): Promise<HasilCuacaOffline> {
  const cache = await ambilCache(kota.latitude, kota.longitude);
  const umurCache = cache ? Date.now() - cache.disimpanPada : Infinity;

  if (cache && umurCache < TTL_SEGAR_MS && !opsi.paksaPerbarui) {
    return { ...cache, sumber: "cache-segar" };
  }

  const dataJaringan = await Promise.all([
    ambilCuaca(kota.latitude, kota.longitude),
    ambilKualitasUdara(kota.latitude, kota.longitude),
  ]).catch(() => null);

  if (!dataJaringan) {
    if (cache) return { ...cache, sumber: "cache-basi" };
    throw new Error("Tidak ada koneksi dan belum ada data tersimpan");
  }

  const [cuaca, kualitasUdara] = dataJaringan;

  try {
    await simpanCache(kota, cuaca, kualitasUdara);
  } catch {
    // Kegagalan menyimpan cache tidak menghalangi tampilan data terbaru.
  }

  return { cuaca, kualitasUdara, disimpanPada: Date.now(), sumber: "jaringan" };
}
