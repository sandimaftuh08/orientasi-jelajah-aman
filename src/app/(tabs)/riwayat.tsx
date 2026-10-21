import { useCallback, useState } from "react";
import { Alert, Button, FlatList, Platform, Text, TouchableOpacity, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../../contexts/theme-context";
import { daftarKotaTersimpan, hapusCacheKota } from "../../services/cacheRepository";
import { ambilSemuaFavorit, hapusFavorit } from "../../services/favoritStorage";
import { bacaRiwayatKota } from "../../services/searchHistory";
import type { KotaFavorit } from "../../types/favorit";
import type { HasilGeocoding } from "../../types/geocoding";
import type { RingkasanKotaTersimpan } from "../../types/cache";

export default function TabRiwayat() {
  const [daftarFavorit, setDaftarFavorit] = useState<KotaFavorit[]>([]);
  const [riwayat, setRiwayat] = useState<HasilGeocoding[]>([]);
  const [cache, setCache] = useState<RingkasanKotaTersimpan[]>([]);
  const { colors } = useAppTheme();

  const muatData = useCallback(() => {
    void Promise.all([ambilSemuaFavorit(), bacaRiwayatKota(), daftarKotaTersimpan()])
      .then(([favorit, pencarian, tersimpan]) => { setDaftarFavorit(favorit); setRiwayat(pencarian); setCache(tersimpan); })
      .catch(() => {});
  }, []);
  useFocusEffect(useCallback(() => { muatData(); }, [muatData]));

  function konfirmasi(pesan: string, aksi: () => void) {
    if (Platform.OS === "web") { if (globalThis.confirm(pesan)) aksi(); return; }
    Alert.alert("Konfirmasi", pesan, [{ text: "Batal", style: "cancel" }, { text: "Hapus", style: "destructive", onPress: aksi }]);
  }

  function bukaKota(kota: HasilGeocoding) {
    router.navigate({ pathname: "/(tabs)", params: { cityId: String(kota.id), cityName: kota.name, lat: String(kota.latitude), lon: String(kota.longitude) } });
  }

  async function hapusCache(kota: RingkasanKotaTersimpan) {
    await hapusCacheKota(kota.kunci);
    setCache((daftar) => daftar.filter((item) => item.kunci !== kota.kunci));
  }

  const judul = (teks: string) => <Text style={{ color: colors.text, fontSize: 18, fontWeight: "700", marginBottom: 8 }}>{teks}</Text>;
  const baris = (nama: string, aksi: () => void, tombol?: { label: string; tekan: () => void }) => (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 12, borderRadius: 12, backgroundColor: colors.backgroundElement, gap: 8 }}>
      <TouchableOpacity onPress={aksi} style={{ flex: 1 }}><Text style={{ color: colors.text, fontSize: 16 }}>{nama}</Text><Text style={{ color: colors.textSecondary, fontSize: 12 }}>Ketuk untuk melihat cuaca</Text></TouchableOpacity>
      {tombol && <Button title={tombol.label} color="#c2413b" onPress={tombol.tekan} />}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        contentContainerStyle={{ padding: 16, gap: 10 }}
        data={[]}
        renderItem={() => null}
        ListHeaderComponent={<View style={{ gap: 22 }}>
          <View style={{ gap: 10 }}>{judul("Pencarian Terakhir")}
            {riwayat.length ? riwayat.map((kota) => <View key={kota.id}>{baris(kota.name, () => bukaKota(kota))}</View>) : <Text style={{ color: colors.textSecondary }}>Belum ada pencarian.</Text>}
          </View>
          <View style={{ gap: 10 }}>{judul("Kota Favorit")}
            {daftarFavorit.length ? daftarFavorit.map((kota) => <View key={kota.id}>{baris(kota.nama, () => bukaKota({ id: kota.id, name: kota.nama, latitude: kota.latitude, longitude: kota.longitude, country: "" }), { label: "Hapus", tekan: () => konfirmasi(`Hapus ${kota.nama} dari favorit?`, () => { void hapusFavorit(kota.id).then(muatData); }) })}</View>) : <Text style={{ color: colors.textSecondary }}>Belum ada kota favorit.</Text>}
          </View>
          <View style={{ gap: 10 }}>{judul("Cache Cuaca Offline")}
            {cache.length ? cache.map((kota) => <View key={kota.kunci}>{baris(kota.nama, () => bukaKota({ id: kota.id, name: kota.nama, latitude: kota.latitude, longitude: kota.longitude, country: "" }), { label: "Hapus cache", tekan: () => konfirmasi(`Hapus cache cuaca ${kota.nama} dari perangkat?`, () => { void hapusCache(kota); }) })}</View>) : <Text style={{ color: colors.textSecondary }}>Belum ada cache cuaca.</Text>}
          </View>
        </View>}
      />
    </SafeAreaView>
  );
}
