// src/services/weatherAdapter.ts
import type { TingkatAQI } from "../types/cuaca";

export function konversiTingkatAQI(indeksEropa: number): TingkatAQI {
  if (indeksEropa <= 20) return "BAIK";
  if (indeksEropa <= 40) return "SEDANG";
  if (indeksEropa <= 60) return "TIDAK_SEHAT";
  return "BERBAHAYA";
}
