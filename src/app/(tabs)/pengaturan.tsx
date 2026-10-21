// src/app/(tabs)/pengaturan.tsx
import { useState } from "react";
import { Button, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { hapusSemuaCache } from "../../services/cacheRepository";
import { useAppTheme } from "../../contexts/theme-context";
import type { PilihanTema } from "../../services/themePreferences";

export default function TabPengaturan() {
  const [pesan, setPesan] = useState<string | null>(null);
  const { colors, pilihan, setPilihan } = useAppTheme();

  async function hapusDataTersimpan() {
    try {
      await hapusSemuaCache();
      setPesan("Data cuaca tersimpan sudah dihapus.");
    } catch {
      setPesan("Data cuaca tersimpan gagal dihapus.");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, gap: 12, backgroundColor: colors.background }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.text }}>Tampilan</Text>
      <Text style={{ color: colors.textSecondary }}>Pilih tema aplikasi</Text>
      <View style={{ gap: 8 }}>
        {([ ["light", "Terang"], ["dark", "Gelap"], ["system", "Ikuti Sistem"] ] as [PilihanTema, string][]).map(([value, label]) => (
          <Button key={value} title={`${pilihan === value ? "✓ " : ""}${label}`} onPress={() => setPilihan(value)} color={pilihan === value ? "#168a83" : undefined} />
        ))}
      </View>
      <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.text }}>Jelajah Aman</Text>
      <Text style={{ color: colors.text }}>Versi 1.0.0</Text>
      <Button title="Hapus Data Cuaca Tersimpan" onPress={hapusDataTersimpan} />
      {pesan && <Text accessibilityLabel={pesan} style={{ color: colors.text }}>{pesan}</Text>}
    </SafeAreaView>
  );
}
