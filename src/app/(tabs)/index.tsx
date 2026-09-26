// src/app/(tabs)/index.tsx

import { useEffect, useState } from "react";
import { ActivityIndicator, Button, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import SearchBox from "../../components/searchbox";
import WeatherCard from "../../components/weathercard";
import { useDebounce } from "../../hooks/use-debounce";
import { cariKota } from "../../services/geocodingService";
import { HasilGeocoding } from "../../types/geocoding";

export default function HalamanUtama() {
  const [teksCari, setTeksCari] = useState("");
  const [hasil, setHasil] = useState<HasilGeocoding[]>([]);
  const [sedangMemuat, setSedangMemuat] = useState(false);
  const [pesanError, setPesanError] = useState<string | null>(null);

  const teksTertunda = useDebounce(teksCari, 800);

  useEffect(() => {
    if (teksTertunda.trim().length === 0) {
      setHasil([]);
      setPesanError(null);
      return;
    }

    ambilData(teksTertunda);
  }, [teksTertunda]);

  async function ambilData(nama: string) {
    setSedangMemuat(true);
    setPesanError(null);

    try {
      const data = await cariKota(nama);
      setHasil(data);
    } catch (err) {
      setPesanError(
        "Gagal mengambil data. Periksa koneksi internet Anda."
      );
    } finally {
      setSedangMemuat(false);
    }
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: 16,
        gap: 16,
      }}
    >
      <SearchBox onCari={setTeksCari} />

      {sedangMemuat && <ActivityIndicator />}

      {pesanError && (
        <View>
          <Text accessibilityLabel={`Pesan error: ${pesanError}`}>
            {pesanError}
          </Text>

          <Button
            title="Coba Lagi"
            onPress={() => ambilData(teksTertunda)}
          />
        </View>
      )}

      {!sedangMemuat &&
        !pesanError &&
        teksTertunda.length > 0 &&
        hasil.length === 0 && (
          <Text accessibilityLabel="Pesan hasil kosong: Kota tidak ditemukan">
            Kota tidak ditemukan
          </Text>
        )}

      {hasil.length > 0 && <Text>Ditemukan {hasil.length} kota</Text>}

      {hasil.map((kota) => (
        <WeatherCard
          key={kota.id}
          kota={kota.name}
          suhu={29}
          tingkatAQI="BAIK"
        />
      ))}
    </SafeAreaView>
  );
}
