import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { spacing, typeScale } from "../../constants/styles";

export default function TabTentang() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View style={{ padding: spacing.sedang, gap: spacing.kecil }}>
        <Text
          accessibilityLabel="Tentang aplikasi Jelajah Aman"
          style={{ fontSize: typeScale.judul, fontWeight: "700" }}
        >
          Jelajah Aman
        </Text>

        <Text style={{ fontSize: typeScale.subjudul }}>Versi 1.0.0</Text>

        <Text style={{ fontSize: typeScale.isi }}>Pembuat: Candra</Text>
      </View>
    </SafeAreaView>
  );
}
