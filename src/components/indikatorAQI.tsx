import { View, Text } from "react-native";
import { LaporanUdara } from "../types/cuaca";

interface IndikatorAQIProps {
  laporan: LaporanUdara;
}

export default function IndikatorAQI({ laporan }: IndikatorAQIProps) {
  let warna = "green";

  if (laporan.tingkat === "SEDANG") {
    warna = "orange";
  } else if (laporan.tingkat === "TIDAK_SEHAT") {
    warna = "red";
  } else if (laporan.tingkat === "BERBAHAYA") {
    warna = "purple";
  }

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontWeight: "bold", fontSize: 18 }}>
        {laporan.kota}
      </Text>

      <Text style={{ fontSize: 24 }}>
        AQI: {laporan.indeksAQI}
      </Text>

      <Text style={{ color: warna }}>
        Tingkat: {laporan.tingkat}
      </Text>

      {laporan.diperbaruiPada && (
        <Text>
          Diperbarui pada: {laporan.diperbaruiPada}
        </Text>
      )}
    </View>
  );
}