// src/types/geocoding.ts
export interface HasilGeocoding {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    admin1?: string; // nama provinsi/wilayah, tidak selalu ada
}

export interface GeocodingResponse {
    results?: HasilGeocoding[]; // opsional -- tidak ada saat pencarian kosong
}