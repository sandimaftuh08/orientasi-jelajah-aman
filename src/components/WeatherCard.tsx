// components/WeatherCard.tsx

import { View, Text } from "react-native";

import { WeatherCardProps, TingkatAQI } from "../types/cuaca";
import { typeScale, spacing } from "../constants/styles";

const WARNA_AQI: Record<TingkatAQI, string> = {
  BAIK: "#2E7D32",
  SEDANG: "#F9A825",
  TIDAK_SEHAT: "#EF6C00",
  BERBAHAYA: "#C62828",
};

export default function WeatherCard({
  kota,
  suhu,
  tingkatAQI,
}: WeatherCardProps) {
  const warnaAQI = WARNA_AQI[tingkatAQI] ?? "#616161";

  return (
    <View
      accessible
      accessibilityLabel={`Cuaca ${kota}, suhu ${suhu} derajat, kualitas udara ${tingkatAQI}`}
      style={{
        padding: spacing.sedang,
        borderRadius: 8,
        backgroundColor: "#F4F7FA",
        gap: spacing.kecil / 2,
      }}
    >
      <Text style={{ fontSize: typeScale.judul, fontWeight: "700" }}>
        {kota}
      </Text>

      <Text style={{ fontSize: typeScale.subjudul }}>{suhu}°C</Text>

      <Text
        style={{
          fontSize: typeScale.isi,
          fontWeight: "600",
          color: warnaAQI,
        }}
      >
        Kualitas udara: {tingkatAQI.replace("_", " ")}
      </Text>
    </View>
  );
}