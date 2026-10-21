import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { spacing, typeScale } from "../../constants/styles";
import { useAppTheme } from "../../contexts/theme-context";

export default function TabTentang() {
  const { colors } = useAppTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: spacing.sedang, gap: spacing.kecil }}>
        <Text
          accessibilityLabel="Tentang aplikasi Jelajah Aman"
          style={{ fontSize: typeScale.judul, fontWeight: "700", color: colors.text }}
        >
          Jelajah Aman
        </Text>

        <Text style={{ fontSize: typeScale.subjudul, color: colors.text }}>Versi 1.0.0</Text>

        <Text style={{ fontSize: typeScale.isi, color: colors.text }}>Pembuat: Sandi maftuh</Text>
      </View>
    </SafeAreaView>
  );
}
