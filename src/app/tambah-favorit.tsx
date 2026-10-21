// src/app/tambah-favorit.tsx
import { View, Text, Button, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { tambahFavorit } from "../services/favoritStorage";

export default function ModalTambahFavorit() {
  const { id, nama, lat, lon } = useLocalSearchParams<{
    id: string;
    nama: string;
    lat: string;
    lon: string;
  }>();

  async function simpan() {
    // 1. Validasi sederhana: pastikan parameter tidak kosong
    if (!id || !nama || !lat || !lon) {
      Alert.alert("Error", "Data kota tidak lengkap atau tidak valid.");
      return;
    }

    try {
      // 2. Eksekusi penyimpanan
      await tambahFavorit({
        id: Number(id),
        nama: nama,
        latitude: Number(lat),
        longitude: Number(lon),
      });
      
      // 3. Kembali ke layar sebelumnya jika berhasil
      router.back();
    } catch (error) {
      console.error("Terjadi kesalahan saat menyimpan:", error);
      Alert.alert("Gagal", "Tidak dapat menyimpan ke favorit.");
    }
  }

  return (
    <View style={{ padding: 24, gap: 16, justifyContent: "center" }}>
      <Text style={{ fontSize: 16, textAlign: "center" }}>
        Tambahkan <Text style={{ fontWeight: "bold" }}>{nama}</Text> ke daftar favorit?
      </Text>
      
      <View style={{ gap: 8 }}>
        <Button title="Simpan" onPress={simpan} />
        {/* Tambahan tombol batal agar user bisa keluar dari modal tanpa menyimpan */}
        <Button title="Batal" color="red" onPress={() => router.back()} />
      </View>
    </View>
  );
}