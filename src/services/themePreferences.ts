import AsyncStorage from "@react-native-async-storage/async-storage";

export type PilihanTema = "light" | "dark" | "system";
const KUNCI_TEMA = "@jelajah_aman:theme";

export async function bacaPilihanTema(): Promise<PilihanTema> {
  try {
    const nilai = await AsyncStorage.getItem(KUNCI_TEMA);
    return nilai === "light" || nilai === "dark" ? nilai : "system";
  } catch {
    return "system";
  }
}

export async function simpanPilihanTema(tema: PilihanTema): Promise<void> {
  await AsyncStorage.setItem(KUNCI_TEMA, tema);
}
