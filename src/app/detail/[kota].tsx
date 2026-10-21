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
        kondisiCuaca="Cerah"
        kecepatanAngin={0}
      />

      <Button
        title="Tambah Favorit"
        accessibilityLabel="Tambahkan kota ini ke daftar favorit"
        onPress={() =>
          router.push({
            pathname: "/tambah-favorit",
            params: { id: "-1", nama: kota, lat: "0", lon: "0" },
          })
        }
      />
    </View>
  );
}
