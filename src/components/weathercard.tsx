// src/components/WeatherCard.tsx
import { Text, View } from "react-native";
import type { WeatherCardProps, TingkatAQI } from "../types/cuaca";
import { typeScale, spacing } from "../constants/styles";

const warnaPerTingkat: Record<TingkatAQI, string> = {
  BAIK: "green",
  SEDANG: "goldenrod",
  TIDAK_SEHAT: "orange",
  BERBAHAYA: "crimson",
};

export default function WeatherCard({
  kota,
  suhu,
  tingkatAQI,
  indeksAQI,
  kondisiCuaca,
  kecepatanAngin,
}: WeatherCardProps) {
  const teksAQI =
    indeksAQI !== undefined
      ? `AQI: ${indeksAQI} (${tingkatAQI})`
      : `AQI: ${tingkatAQI}`;

  const labelAksesibilitas =
    indeksAQI !== undefined
      ? `Cuaca ${kota}, ${kondisiCuaca}, suhu ${suhu} derajat, indeks kualitas udara ${indeksAQI}, kategori ${tingkatAQI}, kecepatan angin ${kecepatanAngin} kilometer per jam`
      : `Cuaca ${kota}, ${kondisiCuaca}, suhu ${suhu} derajat, kualitas udara ${tingkatAQI}, kecepatan angin ${kecepatanAngin} kilometer per jam`;

  return (
    <View
      accessible
      accessibilityLabel={labelAksesibilitas}
      style={{
        padding: spacing.sedang,
        borderRadius: 8,
        backgroundColor: "#F4F7FA",
      }}
    >
      <Text style={{ fontWeight: "bold", fontSize: typeScale.judul }}>
        {kota}
      </Text>
      <Text style={{ fontSize: typeScale.isi, marginTop: spacing.kecil }}>
        {kondisiCuaca}
      </Text>
      <Text style={{ fontSize: 32 }}>{suhu}°C</Text>
      <Text
        style={{ color: warnaPerTingkat[tingkatAQI], fontSize: typeScale.isi }}
      >
        {teksAQI}
      </Text>
      <Text style={{ fontSize: typeScale.isi, marginTop: spacing.kecil }}>
        Angin: {kecepatanAngin} km/j
      </Text>
    </View>
  );
}

