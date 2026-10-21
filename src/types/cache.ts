import type { DataCuacaLengkap, DataKualitasUdara } from "./weather";

export type SumberData = "jaringan" | "cache-segar" | "cache-basi";

export interface KotaUntukCache {
  id: number;
  nama: string;
  latitude: number;
  longitude: number;
}

export interface DataTersimpan {
  cuaca: DataCuacaLengkap;
  kualitasUdara: DataKualitasUdara;
  disimpanPada: number;
}

export interface HasilCuacaOffline extends DataTersimpan {
  sumber: SumberData;
}

export interface RingkasanKotaTersimpan extends KotaUntukCache {
  kunci: string;
  disimpanPada: number;
}
