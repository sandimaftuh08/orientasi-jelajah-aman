import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { useColorScheme as useSystemColorScheme } from "../hooks/use-color-scheme";
import { Colors } from "../constants/theme";
import { bacaPilihanTema, simpanPilihanTema, type PilihanTema } from "../services/themePreferences";

type ThemeContextValue = {
  pilihan: PilihanTema;
  tema: "light" | "dark";
  colors: { readonly text: string; readonly background: string; readonly backgroundElement: string; readonly backgroundSelected: string; readonly textSecondary: string };
  setPilihan: (pilihan: PilihanTema) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const systemScheme = useSystemColorScheme();
  const [pilihan, ubahPilihan] = useState<PilihanTema>("system");

  useEffect(() => {
    void bacaPilihanTema().then(ubahPilihan);
  }, []);

  const setPilihan = useCallback((nilai: PilihanTema) => {
    ubahPilihan(nilai);
    void simpanPilihanTema(nilai).catch(() => {});
  }, []);

  const tema = pilihan === "system" ? (systemScheme === "dark" ? "dark" : "light") : pilihan;
  const value = useMemo(() => ({ pilihan, tema, colors: Colors[tema], setPilihan }), [pilihan, tema, setPilihan]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useAppTheme harus dipakai di dalam ThemeProvider");
  return value;
}
