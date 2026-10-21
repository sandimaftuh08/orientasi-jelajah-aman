// src/components/SearchBox.tsx

import { useState } from "react";
import { TextInput } from "react-native";
import { useAppTheme } from "../contexts/theme-context";

interface SearchBoxProps {
  onCari: (teks: string) => void;
}

export default function SearchBox({ onCari }: SearchBoxProps) {
  const [teks, setTeks] = useState("");
  const { colors, tema } = useAppTheme();

  function handleChange(nilaiBaru: string) {
    setTeks(nilaiBaru);
    onCari(nilaiBaru);
  }

  return (
    <TextInput
      placeholder="Cari nama kota..."
      value={teks}
      onChangeText={handleChange}
      accessibilityLabel="Cari cuaca untuk kota yang dimasukkan"
      placeholderTextColor={colors.textSecondary}
      returnKeyType="search"
      style={{
        minHeight: 50,
        color: colors.text,
        backgroundColor: colors.backgroundElement,
        borderWidth: 1,
        borderColor: tema === "dark" ? "#626873" : "#c9cdd4",
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 12,
        fontSize: 16,
      }}
    />
  );
}

