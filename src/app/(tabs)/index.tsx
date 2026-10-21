import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Button,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import AtribusiCuaca from "../../components/atribusiCuaca";
import SearchBox from "../../components/searchbox";
import StatusData from "../../components/StatusData";
import WeatherCard from "../../components/weathercard";
import { labelKodeCuaca } from "../../constants/weatherCodes";
import { useDebounce } from "../../hooks/use-debounce";
import { bersihkanCacheLama, daftarKotaTersimpan } from "../../services/cacheRepository";
import { BATAS_CACHE_MS, ambilCuacaOfflineFirst } from "../../services/cuacaRepository";
import { cariKota } from "../../services/geocodingService";
import { ambilKoordinatSaatIni, mintaIzinLokasi } from "../../services/locationServices";
import { ambilSemuaFavorit } from "../../services/favoritStorage";
import { bacaRiwayatKota, simpanRiwayatKota } from "../../services/searchHistory";
import { konversiTingkatAQI } from "../../services/weatherAdapter";
import type { KotaFavorit } from "../../types/favorit";
import type { HasilGeocoding } from "../../types/geocoding";
import type { HasilCuacaOffline, RingkasanKotaTersimpan } from "../../types/cache";
import { useAppTheme } from "../../contexts/theme-context";
import { useLocalSearchParams } from "expo-router";

export default function HalamanUtama() {
  const [teksCari, setTeksCari] = useState("");
  const [hasilPencarian, setHasilPencarian] = useState<HasilGeocoding[]>([]);
  const [kotaTerpilih, setKotaTerpilih] = useState<HasilGeocoding | null>(null);
  const [hasil, setHasil] = useState<HasilCuacaOffline | null>(null);
  const [daftarFavorit, setDaftarFavorit] = useState<KotaFavorit[]>([]);
  const [favoritSudahDimuat, setFavoritSudahDimuat] = useState(false);
  const [kotaTersimpan, setKotaTersimpan] = useState<RingkasanKotaTersimpan[]>([]);
  const [sedangMemuat, setSedangMemuat] = useState(false);
  const [pesanError, setPesanError] = useState<string | null>(null);
  const [pesanLokasi, setPesanLokasi] = useState<string | null>(null);
  const teksTertunda = useDebounce(teksCari, 500);
  const requestIdRef = useRef(0);
  const { colors } = useAppTheme();
  const params = useLocalSearchParams<{ cityId?: string; cityName?: string; lat?: string; lon?: string }>();

  useEffect(() => {
    if (!params.cityName || !params.lat || !params.lon || !params.cityId) return;
    const kota: HasilGeocoding = { id: Number(params.cityId), name: params.cityName, country: "", latitude: Number(params.lat), longitude: Number(params.lon) };
    setTeksCari(kota.name);
    void pilihKota(kota);
    router.setParams({ cityId: undefined, cityName: undefined, lat: undefined, lon: undefined });
  }, [params.cityId, params.cityName, params.lat, params.lon]);

  useFocusEffect(
    useCallback(() => {
      let masihAktif = true;
      setFavoritSudahDimuat(false);

      void ambilSemuaFavorit().then((favorit) => {
        if (masihAktif) {
          setDaftarFavorit(favorit);
          setFavoritSudahDimuat(true);
        }
      });

      return () => {
        masihAktif = false;
      };
    }, [])
  );

  useEffect(() => {
    let masihAktif = true;

    async function muatKotaTersimpan() {
      try {
        await bersihkanCacheLama(BATAS_CACHE_MS);
        const daftar = await daftarKotaTersimpan();
        if (masihAktif) setKotaTersimpan(daftar);
      } catch {
        if (masihAktif) setKotaTersimpan([]);
      }
    }

    void muatKotaTersimpan();
    return () => {
      masihAktif = false;
    };
  }, []);

  useEffect(() => {
    let masihAktif = true;
    const kueri = teksTertunda.trim();

    if (!kueri) {
      setHasilPencarian([]);
      return () => {
        masihAktif = false;
      };
    }

    cariKota(kueri)
      .then((daftar) => {
        if (masihAktif) setHasilPencarian(daftar);
      })
      .catch(() => {
        if (masihAktif) setHasilPencarian([]);
      });

    return () => {
      masihAktif = false;
    };
  }, [teksTertunda]);

  async function pilihKota(kota: HasilGeocoding, paksaPerbarui = false) {
    const idPermintaan = ++requestIdRef.current;
    setKotaTerpilih(kota);
    setSedangMemuat(true);
    setPesanError(null);

    try {
      const data = await ambilCuacaOfflineFirst(
        {
          id: kota.id,
          nama: kota.name,
          latitude: kota.latitude,
          longitude: kota.longitude,
        },
        { paksaPerbarui }
      );

      if (idPermintaan !== requestIdRef.current) return;

      setHasil(data);
      void simpanRiwayatKota(kota);
      void daftarKotaTersimpan()
        .then(setKotaTersimpan)
        .catch(() => {});
    } catch {
      if (idPermintaan !== requestIdRef.current) return;

      setHasil(null);
      setPesanError(
        "Belum ada data tersimpan dan tidak ada koneksi internet. Sambungkan internet lalu coba lagi."
      );
    } finally {
      if (idPermintaan === requestIdRef.current) setSedangMemuat(false);
    }
  }

  async function gunakanLokasiSaatIni() {
    try {
      const status = await mintaIzinLokasi();

      if (status === "denied") {
        setPesanLokasi("Izin lokasi ditolak. Silakan cari kota secara manual di atas.");
        return;
      }

      if (status === "unavailable") {
        setPesanLokasi(
          "Layanan lokasi tidak aktif di perangkat ini. Silakan cari kota secara manual."
        );
        return;
      }

      setPesanLokasi(null);
      const koordinat = await ambilKoordinatSaatIni();
      await pilihKota({
        id: -1,
        name: "Lokasi Saat Ini",
        latitude: koordinat.latitude,
        longitude: koordinat.longitude,
        country: "",
      });
    } catch {
      setPesanLokasi("Lokasi tidak dapat diambil. Silakan cari kota secara manual.");
    }
  }

  function pilihKotaTersimpan(kota: RingkasanKotaTersimpan) {
    void pilihKota({
      id: kota.id,
      name: kota.nama,
      latitude: kota.latitude,
      longitude: kota.longitude,
      country: "",
    });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        <SearchBox onCari={setTeksCari} />
        <Button title="Gunakan Lokasi Saat Ini" onPress={gunakanLokasiSaatIni} />
        {pesanLokasi && <Text accessibilityLabel={pesanLokasi}>{pesanLokasi}</Text>}

        {hasilPencarian.map((kota) => (
          <TouchableOpacity key={kota.id} onPress={() => void pilihKota(kota)}>
            <Text style={{ color: colors.text }}>{kota.name}</Text>
          </TouchableOpacity>
        ))}

        {kotaTersimpan.length > 0 && (
          <View style={{ gap: 6 }}>
            <Text style={{ fontWeight: "bold" }}>
              Tersimpan di perangkat (bisa dibuka offline)
            </Text>
            {kotaTersimpan.map((kota) => (
              <TouchableOpacity key={kota.kunci} onPress={() => pilihKotaTersimpan(kota)}>
                <Text style={{ color: colors.text }}>{kota.nama}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {sedangMemuat && <ActivityIndicator />}
        {pesanError && (
          <View>
            <Text accessibilityLabel={pesanError}>{pesanError}</Text>
            <Button
              title="Coba Lagi"
              onPress={() => {
                if (kotaTerpilih) void pilihKota(kotaTerpilih, true);
              }}
            />
          </View>
        )}

        {hasil && kotaTerpilih && !sedangMemuat && (
          <>
            <StatusData sumber={hasil.sumber} disimpanPada={hasil.disimpanPada} />
            <WeatherCard
              kota={kotaTerpilih.name}
              suhu={hasil.cuaca.saatIni.suhu}
              tingkatAQI={konversiTingkatAQI(hasil.kualitasUdara.indeksAQI)}
              indeksAQI={hasil.kualitasUdara.indeksAQI}
              kondisiCuaca={labelKodeCuaca(hasil.cuaca.saatIni.kodeCuaca)}
              kecepatanAngin={hasil.cuaca.saatIni.kecepatanAngin}
            />
            <Text style={{ fontSize: 12, color: "#888888" }}>
              Kondisi: {labelKodeCuaca(hasil.cuaca.saatIni.kodeCuaca)} {"\u2022"} Angin{" "}
              {hasil.cuaca.saatIni.kecepatanAngin} km/j
            </Text>
            <Button
              title="Perbarui Sekarang"
              onPress={() => void pilihKota(kotaTerpilih, true)}
            />
            {favoritSudahDimuat &&
              !daftarFavorit.some((favorit) => favorit.id === kotaTerpilih.id) && (
                <Button
                  title="Tambahkan ke Favorit"
                  onPress={() =>
                    router.push({
                      pathname: "/tambah-favorit",
                      params: {
                        id: String(kotaTerpilih.id),
                        nama: kotaTerpilih.name,
                        lat: String(kotaTerpilih.latitude),
                        lon: String(kotaTerpilih.longitude),
                      },
                    })
                  }
                />
              )}
          </>
        )}

        <AtribusiCuaca />
      </ScrollView>
    </SafeAreaView>
  );
}
