// src/components/AtribusiCuaca.tsx
import { Text, TouchableOpacity, Linking } from "react-native";

export default function AtribusiCuaca() {
  return (
    <TouchableOpacity onPress={() => Linking.openURL("https://open-meteo.com/")}>
      <Text style={{ fontSize: 11, color: "#888", textAlign: "center" }}>
        Data cuaca disediakan oleh Open-Meteo.com
      </Text>
    </TouchableOpacity>
  );
}