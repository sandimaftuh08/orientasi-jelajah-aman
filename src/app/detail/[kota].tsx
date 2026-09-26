// app/detail/[kota].tsx

import { View, Button } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import WeatherCard from "../../components/weathercard";

export default function HalamanDetail() {
  const { kota } = useLocalSearchParams<{ kota: string }>();

  return (
    <View style={{ padding: 16, gap: 16 }}>
      <WeatherCard
        kota={kota}
        suhu={29}
        tingkatAQI="BAIK"
      />

      <Button
        title="Tambah Favorit"
        accessibilityLabel="Tambahkan kota ini ke daftar favorit"
        onPress={() => router.push("/tambah-favorit")}
      />
    </View>
  );
}