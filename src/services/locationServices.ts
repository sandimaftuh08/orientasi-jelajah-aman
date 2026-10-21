// src/services/locationService.ts
import * as Location from "expo-location";

export type StatusIzinLokasi = "granted" | "denied" | "unavailable";

export async function mintaIzinLokasi(): Promise<StatusIzinLokasi> {
  const layananAktif = await Location.hasServicesEnabledAsync();
  if (!layananAktif) {
    return "unavailable";
  }

  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === "granted" ? "granted" : "denied";
}

export async function ambilKoordinatSaatIni() {
  const lokasi = await Location.getCurrentPositionAsync({});
  return {
    latitude: lokasi.coords.latitude,
    longitude: lokasi.coords.longitude,
  };
}